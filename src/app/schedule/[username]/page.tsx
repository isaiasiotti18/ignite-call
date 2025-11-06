import { prisma } from "@/lib/prisma";
import { Schedule } from "./Schedule"; // Import do Client Component
import { notFound } from "next/navigation";

// ✅ Gera página sob demanda e revalida a cada 60s
export const revalidate = 60 * 60 * 24;
export const dynamicParams = true;

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return notFound();

  return (
    <Schedule
      user={{
        avatarUrl: user.avatar_url,
        bio: user.bio,
        name: user.name,
      }}
    />
  );
}
