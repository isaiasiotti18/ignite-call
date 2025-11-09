import { prisma } from "@/lib/prisma";
import { endOfDay, isBefore, setHours } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  if (req.method !== "GET") {
    return new NextResponse(null, {
      status: 405,
    });
  }

  const { params } = context;
  const { username } = await params; // <-- await aqui

  const date = req.nextUrl.searchParams.get("date");

  if (!date) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Date not provided.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return new NextResponse(null, {
      status: 400,
      statusText: "User not found.",
    });
  }

  const referenceDate = new Date(String(date));
  const isPastDate = isBefore(endOfDay(referenceDate), new Date());

  if (isPastDate) {
    return NextResponse.json({ possibleTimes: [], availableTimes: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.getUTCDay(), // 0 = domingo, 1 = segunda, etc.
    },
  });

  if (!userAvailability)
    return NextResponse.json({ possibleTimes: [], availableTimes: [] });

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i;
    }
  );

  const startDate = new Date(referenceDate);
  startDate.setUTCHours(startHour, 0, 0, 0);

  const endDate = new Date(referenceDate);
  endDate.setUTCHours(endHour, 0, 0, 0);

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getUTCHours() === time
    );

    // cria uma nova data com a hora ajustada
    const timeWithHour = setHours(referenceDate, time);

    const isTimeInPast = isBefore(timeWithHour, new Date());

    return !isTimeBlocked && !isTimeInPast;
  });

  console.log("possibleTimes & availableTimes: ", {
    possibleTimes,
    availableTimes,
  });

  return NextResponse.json({ possibleTimes, availableTimes });
}
