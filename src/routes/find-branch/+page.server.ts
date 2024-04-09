import { prisma } from "$lib/db/client";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const branches = await prisma.branch.findMany({
    where: {
      disabled: false,
    },
  });

  return {
    branches,
  };
};
