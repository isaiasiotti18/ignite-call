import { prisma } from "@/lib/prisma";
import { isBefore, startOfHour } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

interface ScheduleRequestBody {
  name: string;
  email: string;
  observations?: string;
  date: Date;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  if (req.method !== "POST") {
    return new NextResponse(null, {
      status: 405,
    });
  }

  const { params } = context;
  const { username } = await params; // <-- await aqui

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

  const { name, email, observations, date }: ScheduleRequestBody =
    await req.json();

  const schedulingDate = startOfHour(new Date(date));

  if (isBefore(schedulingDate, new Date())) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Date is in the past",
    });
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate,
    },
  });

  if (conflictingScheduling) {
    return new NextResponse(null, {
      status: 400,
      statusText: "There is another scheduling at at the same time.",
    });
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate,
      user_id: user.id,
    },
  });

  return NextResponse.json({ scheduling });
}
