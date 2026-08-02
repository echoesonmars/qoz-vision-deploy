import {
  admCardHeaderMutedClass,
  admCardInteractiveClass,
  admChecksCardHeaderClass,
  admKickerClass,
} from "@/lib/brand/ui-classes";
import { cn } from "@/lib/utils";

export const summaryCardInteractive = admCardInteractiveClass;

export const summaryCardHeaderMuted = admCardHeaderMutedClass;

export const summaryKicker = admKickerClass;

export const checksCardInteractive = cn(summaryCardInteractive, "gap-2");

export const checksCardHeader = admChecksCardHeaderClass;
