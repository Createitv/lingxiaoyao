import { getCurrentUser } from "./session";
import { prisma } from "@/lib/db/prisma";

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "admin") return null;
  return user;
}
