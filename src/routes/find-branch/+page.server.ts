import { prisma } from "$lib/db/client";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const branches = await prisma.branch.findMany();

  if (!branches || branches.length === 0) {
    error(404, "No branches found");
  }

  return {
    branches,
  };
};
