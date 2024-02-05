import { prisma } from "../src/lib/db/client.ts";

async function main() {
  const testface = await prisma.user.upsert({
    where: { email: "testface@prisma.io" },
    update: {},
    create: {
      email: "testface@prisma.io",
      name: "testface",
      password: "password",
    },
  });
  console.log({ testface });
}

main();
