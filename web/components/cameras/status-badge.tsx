import { Badge } from "@/components/ui/badge";
import { admStatusSuccessSoftClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  online: boolean;
};

export function StatusBadge({ online }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "font-normal",
        online
          ? admStatusSuccessSoftClass
          : "bg-destructive/10 text-destructive hover:bg-destructive/15",
      )}
    >
      {online ? "Онлайн" : "Офлайн"}
    </Badge>
  );
}
