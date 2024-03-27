import { UserRole } from "@prisma/client";
import { prisma } from "../src/lib/db/client.ts";

async function seedBranches() {
  await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Montréal-Trudeau International Airport",
      description:
        "Conveniently grab a car after your flight into Montréal. Enjoy the smooth, well-maintained roads that Québec has to offer.",
      streetAddress: "975 boul. Roméo-Vachon N",
      city: "Dorval",
      region: "QC",
      country: "CA",
      postalCode: "H4Y 1H1",
      iataAirportCode: "YUL",
      latitude: 45.4656587641663,
      longitude: -73.74548542331343,
      timezone: "America/Toronto",
    },
  });
}

async function seedMain() {
  await prisma.user.upsert({
    where: { email: "admin@prisma.io" },
    update: {},
    create: {
      email: "admin@prisma.io",
      name: "Admin Man",
      comment: "Main ADMIN account.",
      role: UserRole.ADMIN,
      // SuperSecurePassword!   //TODO: We can make this a secret
      passwordHash:
        "$2b$12$16VZC7zWzO1VYW.hENoWgusJLoQ9FDL/1jtzQ5J/SHFU2Rn.CDxTK",
    },
  });

  await seedBranches();
}

async function main() {
  await seedMain();
}

main();
