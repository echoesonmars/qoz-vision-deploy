"use client";

import { useCallback, useRef, useState } from "react";
import { MdCloudUpload, MdMovie } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { uploadVideoFromBrowser } from "@/lib/supabase/browser-storage-upload";
import { isBrowserSupabaseStorageEnabled } from "@/lib/supabase/public-key";
import {
  MAX_VIDEO_UPLOAD_LABEL,
  isVideoWithinSizeLimit,
  videoUploadSizeError,
} from "@/lib/video-upload-limits";

function usePresignedDirectUpload(uploadUrl: string): boolean {
  return (
    uploadUrl === "/api/lessons" ||
    uploadUrl.endsWith("/api/lessons") ||
    uploadUrl === "/api/incidents" ||
    uploadUrl.endsWith("/api/incidents")
  );
}

function presignApiPath(uploadUrl: string): string {
  return uploadUrl.includes("/lessons") ? "/api/lessons/presign" : "/api/incidents/presign";
}

function registerApiPath(uploadUrl: string): string {
  return uploadUrl.includes("/lessons") ? "/api/lessons/register" : "/api/incidents/register";
}

function storageUploadApiPath(uploadUrl: string): string {
  return uploadUrl.includes("/lessons") ? "/api/lessons/upload" : "/api/incidents/upload";
}

type UploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: () => void;
  uploadUrl?: string;
  hintAfterPick?: string;
};

export function UploadDialog({
  open,
  onOpenChange,
  onUploaded,
  uploadUrl = "/api/incidents",
  hintAfterPick = "Тип инцидента определит ИИ после загрузки",
}: UploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const presigned = usePresignedDirectUpload(uploadUrl);

  const pickFile = useCallback((next: File | null) => {
    if (!next) {
      setFile(null);
      return;
    }
    if (!next.type.startsWith("video/")) {
      setError("Выберите видеофайл");
      setFile(null);
      return;
    }
    if (!isVideoWithinSizeLimit(next.size)) {
      setError(videoUploadSizeError());
      setFile(null);
      return;
    }
    setError(null);
    setFile(next);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Выберите файл");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (presigned) {
        const presignRes = await fetch(presignApiPath(uploadUrl), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type || "video/mp4",
            sizeBytes: file.size,
          }),
        });
        const presign = (await presignRes.json()) as {
          storagePath?: string;
          error?: string;
        };
        if (!presignRes.ok || !presign.storagePath) {
          throw new Error(presign.error ?? presignRes.statusText);
        }
        if (isBrowserSupabaseStorageEnabled()) {
          await uploadVideoFromBrowser(
            presign.storagePath,
            file,
            file.type || "video/mp4",
          );
        } else {
          const uploadFd = new FormData();
          uploadFd.set("file", file);
          uploadFd.set("storagePath", presign.storagePath);
          const upRes = await fetch(storageUploadApiPath(uploadUrl), {
            method: "POST",
            body: uploadFd,
          });
          const upData = (await upRes.json()) as { error?: string };
          if (!upRes.ok) {
            throw new Error(upData.error ?? `Storage upload failed (${upRes.status})`);
          }
        }
        const regRes = await fetch(registerApiPath(uploadUrl), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storagePath: presign.storagePath }),
        });
        const data = (await regRes.json()) as { error?: string };
        if (!regRes.ok) {
          throw new Error(data.error ?? regRes.statusText);
        }
      } else {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch(uploadUrl, { method: "POST", body: fd });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? res.statusText);
        }
      }
      setFile(null);
      onOpenChange(false);
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setFile(null);
      setError(null);
      setDragOver(false);
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <DialogTitle className="text-lg font-semibold">Загрузить видео</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(ev) => pickFile(ev.target.files?.[0] ?? null)}
          />
          <Card
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pickFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={cn(
              "cursor-pointer items-center justify-center border-2 border-dashed bg-muted/20 py-10 ring-0 transition-all",
              dragOver
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : "border-border/80 hover:border-primary/50 hover:bg-primary/[0.03]",
            )}
          >
            <div className="flex flex-col items-center gap-3 px-4 text-center">
              <span
                className={cn(
                  "flex size-14 items-center justify-center rounded-2xl transition-colors",
                  dragOver ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                )}
              >
                {file ? (
                  <MdMovie className="size-8" aria-hidden />
                ) : (
                  <MdCloudUpload className="size-8" aria-hidden />
                )}
              </span>
              {file ? (
                <>
                  <p className="max-w-full truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{hintAfterPick}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">Перетащите видео сюда</p>
                  <p className="text-xs text-muted-foreground">
                    или нажмите для выбора · до {MAX_VIDEO_UPLOAD_LABEL}
                  </p>
                </>
              )}
            </div>
          </Card>
          {error ? <p className="text-destructive text-center text-sm">{error}</p> : null}
          <Button
            type="submit"
            disabled={busy || !file}
            className="h-11 w-full gap-2 rounded-xl bg-primary text-base font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:shadow-none"
          >
            <MdCloudUpload className="size-5" aria-hidden />
            {busy ? "Загрузка…" : "Загрузить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
