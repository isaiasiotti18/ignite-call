import { prisma } from "@/lib/prisma";
import { Schedule } from "./Schedule"; // Import do Client Component

// ✅ Gera página sob demanda e revalida a cada 60s
export const revalidate = 60 * 60 * 24;
export const dynamicParams = true;

export default async function SchedulePage({
  params,
}: {
  params: { username: string };
}) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
  });

  if (!user) {
    // Gera 404 no App Router
    return <h1>Usuário não encontrado</h1>;
  }

  return (
    <Schedule
      user={{
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      }}
    />
  );
}
