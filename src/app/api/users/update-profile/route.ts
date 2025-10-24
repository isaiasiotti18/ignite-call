import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";

const updateProfileBodySchema = z.object({
  bio: z.string(),
});

type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>;

export async function PUT(req: NextRequest) {
  if (req.method !== "PUT") {
    return new NextResponse(null, {
      status: 401,
    });
  }

  const session = await getServerSession(buildNextAuthOptions());

  if (!session) {
    return new NextResponse(null, {
      status: 401,
    });
  }

  const { bio }: UpdateProfileBodySchema = await req.json();

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  });

  return new NextResponse(null, {
    status: 204,
    statusText: "No Content.",
  });
}
