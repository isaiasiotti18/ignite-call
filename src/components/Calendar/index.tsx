import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./style";
import { getWeekDays } from "@/utils/get-week-days";
import { useMemo, useState } from "react";

import {
  addDays,
  addMonths,
  endOfDay,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  isBefore,
  setDate,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useParams } from "next/navigation";

type CalendarDay = {
  date: Date;
  disabled?: boolean;
};

type CalendarDays = CalendarDay[];

interface CalendarWeek {
  week: number;
  days: CalendarDays;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDates {
  blockedWeekDays: number[];
  blockedDates: number[];
}

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelected: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() =>
    startOfMonth(new Date())
  );

  const params = useParams<{ username: string }>();
  const username = params.username;

  const shortWeekDays = getWeekDays({ short: true });

  function handlePreviousMonth() {
    const previousMonthDate = subMonths(currentDate, 1);
    setCurrentDate(previousMonthDate);
  }

  function handleNextMonth() {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
  }

  // Locale aplicado corretamente aqui
  const currentMonth = format(currentDate, "MMMM", { locale: ptBR });
  const currentYear = format(currentDate, "yyyy", { locale: ptBR });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based igual ao dayjs

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: ["blocked-dates", year, month],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year,
          month: month + 1,
        },
      });
      console.log(response.data);
      return response.data;
    },
  });

  const calendarWeeks = useMemo(() => {
    const firstDay = startOfMonth(currentDate);
    const daysInMonthArray = Array.from({
      length: getDaysInMonth(currentDate),
    }).map((_, index) => addDays(firstDay, index));

    const firstWeekDay = currentDate.getDay();
    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        return subDays(currentDate, index + 1);
      })
      .reverse();

    const lastDayInCurrentMonth = setDate(
      currentDate,
      getDaysInMonth(currentDate)
    );
    const lastWeekDay = getDay(lastDayInCurrentMonth);
    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return addDays(lastDayInCurrentMonth, i + 1);
    });

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            isBefore(endOfDay(date), new Date()) ||
            blockedDates?.blockedWeekDays?.includes(getDay(date)) ||
            blockedDates?.blockedDates?.includes(getDate(date)),
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0;

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          });
        }

        return weeks;
      },
      []
    );

    return calendarWeeks;
  }, [currentDate, blockedDates]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous Month">
            <ChevronLeft />
          </button>

          <button onClick={handleNextMonth} title="Next Month">
            <ChevronRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toISOString()}>
                      <CalendarDay
                        onClick={() => onDateSelected(date)}
                        disabled={disabled}
                      >
                        {date.getDate()}
                      </CalendarDay>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
