import { useState } from "react";
import { CalendarStep } from "./CalendarStep";
//import { ConfirmStep } from "./ConfirmStep";

interface ScheduleFormProps {
  username: string;
}

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />;
}
