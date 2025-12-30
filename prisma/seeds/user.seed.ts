import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

export async function seedUser(prisma: PrismaClient) {
  const root = await prisma.user.upsert({
    where: { username: process.env.ROOT_DATABASE_USERNAME },
    update: {},
    create: {
      username: process.env.ROOT_DATABASE_USERNAME ?? "admin",
      name: process.env.ROOT_DATABASE_NAME ?? "Administrador",
      password: hashSync(process.env.ROOT_DATABASE_PASSWORD ?? "123456789"),
    },
  });

  console.log("✅ Usuário root criado:", root.username);
}
