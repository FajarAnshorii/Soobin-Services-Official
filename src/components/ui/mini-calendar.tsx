"use client";

import * as React from "react";
import {
  format,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DAYS_OF_WEEK = [
  { key: "sun", label: "Sun" },
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
];

export interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate: externalSelectedDate,
  onSelectDate,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const activeDate = externalSelectedDate || selectedDate;
  const [currentWeek, setCurrentWeek] = React.useState<Date>(activeDate);

  React.useEffect(() => {
    if (externalSelectedDate) {
      setCurrentWeek(externalSelectedDate);
    }
  }, [externalSelectedDate]);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 0 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 0 }),
  });

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-xs">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          {format(currentWeek, "MMMM yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center mb-2 px-4 pt-3">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="text-xs font-bold text-slate-600"
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 p-4 pt-0">
        {weekDays.map((day) => {
          const isSelected =
            format(day, "yyyy-MM-dd") === format(activeDate, "yyyy-MM-dd");

          return (
            <Button
              key={day.toString()}
              variant={isSelected ? "default" : "ghost"}
              className={cn(
                "h-10 w-full p-0 font-bold rounded-xl transition-all",
                isSelected && "bg-slate-900 text-white hover:bg-black hover:text-white font-black shadow-sm"
              )}
              onClick={() => {
                setSelectedDate(day);
                if (onSelectDate) onSelectDate(day);
              }}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
