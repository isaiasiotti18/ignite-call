import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface CreateUserBody {
  name: string;
  username: string;
}

export async function POST(req: NextRequest) {
  const res = NextResponse;

  const cookieStore = await cookies();

  const { name, username }: CreateUserBody = await req.json();

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    return res.json(400, {
      status: 400,
      statusText: "Nome de usuário já existe.",
    });
  }

  const user = await prisma.user.create({
    data: {
      username,
      name,
    },
  });

  cookieStore.set({
    name: "@ignitecall:userId",
    value: user.id,
    maxAge: 60 * 60 * 24 * 7, //7dias
    path: "/",
  });

  return res.json(user, { status: 201 });
}
