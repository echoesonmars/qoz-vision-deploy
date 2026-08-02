import { ADM_COPY } from "@/lib/brand/copy";
import { AdmLogo } from "@/components/brand/adm-logo";
import { admPageClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

type AdmLoadingScreenProps = {
  variant?: "page" | "inline";
  message?: string;
  className?: string;
};

export function AdmLoadingScreen({
  variant = "inline",
  message = ADM_COPY.loadingText,
  className,
}: AdmLoadingScreenProps) {
  if (variant === "page") {
    return (
      <div className={cn(admPageClass, "flex flex-col items-center justify-center gap-6 p-6", className)}>
        <AdmLogo size="lg" priority />
        <div className="flex flex-col items-center gap-3">
          <div
            className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
            role="status"
            aria-label={message}
          />
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 py-2", className)} role="status" aria-label={message}>
      <div className="size-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
