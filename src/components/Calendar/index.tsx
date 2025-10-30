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
  format,
  getDay,
  getDaysInMonth,
  setDate,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() =>
    startOfMonth(new Date())
  );

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

    return [
      ...previousMonthFillArray,
      ...daysInMonthArray,
      ...nextMonthFillArray,
    ];
  }, [currentDate]);

  console.log(calendarWeeks);

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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}
