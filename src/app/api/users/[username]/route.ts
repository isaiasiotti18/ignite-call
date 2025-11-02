import { prisma } from "@/lib/prisma";
import { endOfDay, isBefore } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ username: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  if (req.method !== "GET") {
    return new NextResponse(null, {
      status: 405,
    });
  }

  const { username } = await params;
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
      week_day: referenceDate.getDay(), // 0 = domingo, 1 = segunda, etc.
    },
  });
}
