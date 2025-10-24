import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
});

type TimeIntervalsBodySchema = z.infer<typeof timeIntervalsBodySchema>;

export async function POST(req: NextRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerSession(buildNextAuthOptions());

  if (!session) {
    return res.status(401).end();
  }

  const { intervals }: TimeIntervalsBodySchema = await req.json();

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      });
    })
  );

  return NextResponse.json(201, {
    status: 201,
    statusText: "Created",
  });
}
