import { Progress } from "@/components/ui/progress";
import { admProgressIndicatorClass } from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

type TelemetryProgressProps = {
  value: number;
  className?: string;
};

export function TelemetryProgress({ value, className }: TelemetryProgressProps) {
  return (
    <Progress
      value={value}
      className={cn("h-2", className, admProgressIndicatorClass)}
    />
  );
}
