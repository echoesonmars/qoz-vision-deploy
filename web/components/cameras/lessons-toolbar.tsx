"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MdCalendarToday, MdClose, MdCloudUpload, MdSearch } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type LessonsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  date: Date | undefined;
  onDateChange: (value: Date | undefined) => void;
  onUploadClick: () => void;
};

export function LessonsToolbar({
  search,
  onSearchChange,
  date,
  onDateChange,
  onUploadClick,
}: LessonsToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1 sm:min-w-48">
          <MdSearch
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по названию или дате"
            className="h-10 pl-10"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-10 w-full justify-start gap-2 font-normal sm:w-48",
                !date && "text-muted-foreground",
              )}
            >
              <MdCalendarToday className="size-4 shrink-0" aria-hidden />
              {date ? format(date, "dd.MM.yyyy", { locale: ru }) : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={onDateChange} locale={ru} />
            {date ? (
              <div className="border-t border-border p-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => onDateChange(undefined)}
                >
                  <MdClose className="size-4" aria-hidden />
                  Сбросить
                </Button>
              </div>
            ) : null}
          </PopoverContent>
        </Popover>
      </div>
      <Button
        type="button"
        className="h-10 w-full shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 md:w-auto"
        onClick={onUploadClick}
      >
        <MdCloudUpload className="size-5" aria-hidden />
        Загрузить видео
      </Button>
    </div>
  );
}
