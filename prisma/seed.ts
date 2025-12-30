import { PrismaClient } from "@prisma/client";
import { seedUser } from "./seeds/user.seed";
import { seedUnits } from "./seeds/unit.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando seed do banco de dados...\n");

  await seedUser(prisma);
  await seedUnits(prisma);

  console.log("\n✅ Seed concluído com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
