"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDirectorLocale } from "@/lib/director/i18n/locale-context";

type DirectorConfirmActionProps = {
  title?: string;
  description?: string;
  confirmLabel?: string;
  children: (openConfirm: () => void) => ReactNode;
  onConfirm: () => void;
};

export function DirectorConfirmAction({
  title,
  description,
  confirmLabel,
  children,
  onConfirm,
}: DirectorConfirmActionProps) {
  const { tr } = useDirectorLocale();
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    onConfirm();
    setOpen(false);
  }

  return (
    <>
      {children(() => setOpen(true))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title ?? tr("confirmTitle")}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {tr("cancel")}
            </Button>
            <Button type="button" onClick={handleConfirm}>
              {confirmLabel ?? tr("confirmAction")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
