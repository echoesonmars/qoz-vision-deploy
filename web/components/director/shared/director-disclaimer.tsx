import { cn } from "@/lib/utils";
import { MdInfoOutline } from "react-icons/md";

type DirectorDisclaimerProps = {
  children: React.ReactNode;
  className?: string;
};

export function DirectorDisclaimer({ children, className }: DirectorDisclaimerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl bg-muted/40 p-4 ring-1 ring-border/60",
        className,
      )}
    >
      <MdInfoOutline className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
      <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
    </div>
  );
}
