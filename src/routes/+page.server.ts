import { prisma } from "$lib/db/client";
import type { Actions } from "@sveltejs/kit";

export const actions = {
  makeAdmin: async () => {
    await prisma.user.create({
      data: {
        name: "Admin Man",
        email: "admin@gmail.com",
        role: "ADMIN",
        passwordHash:
          "$2b$12$16VZC7zWzO1VYW.hENoWgusJLoQ9FDL/1jtzQ5J/SHFU2Rn.CDxTK", // SuperSecurePassword!
      },
    });
  },
} satisfies Actions;
