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
  dayOrderCounts?: Record<string, number>;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate: externalSelectedDate,
  onSelectDate,
  dayOrderCounts = {},
}) => {
  const [internalSelectedDate, setInternalSelectedDate] = React.useState<Date>(new Date());
  const selectedDate = externalSelectedDate !== undefined ? externalSelectedDate : internalSelectedDate;
  const [currentWeek, setCurrentWeek] = React.useState<Date>(selectedDate || new Date());

  React.useEffect(() => {
    if (externalSelectedDate) {
      setCurrentWeek(externalSelectedDate);
    }
  }, [externalSelectedDate]);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 0 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 0 }),
  });

  const handleSelect = (day: Date) => {
    setInternalSelectedDate(day);
    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-white text-slate-900 shadow-xs">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          className="hover:bg-slate-100 text-slate-900"
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
          className="hover:bg-slate-100 text-slate-900"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center py-2 px-4 bg-slate-50 border-b border-slate-200">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="text-[11px] font-black text-slate-700"
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-4 pt-3">
        {weekDays.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const isSelected =
            format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
          const orderCount = dayOrderCounts[dateKey] || 0;

          return (
            <div key={day.toString()} className="relative flex flex-col items-center py-1">
              <Button
                variant={isSelected ? "default" : "ghost"}
                className={cn(
                  "h-9 w-9 p-0 font-bold relative text-slate-900 rounded-xl transition-all",
                  isSelected && "bg-slate-900 text-white hover:bg-black hover:text-white font-black shadow-md scale-105"
                )}
                onClick={() => handleSelect(day)}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </Button>
              {orderCount > 0 && (
                <span className={cn(
                  "mt-1 text-[9px] font-black px-1.5 py-0.2 rounded-full border shadow-2xs",
                  isSelected ? "bg-amber-400 text-slate-900 border-amber-500" : "bg-slate-900 text-white border-slate-800"
                )}>
                  {orderCount} order
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
