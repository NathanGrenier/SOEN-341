import { prisma } from "$lib/db/client";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = async () => {
  return {
    cars: await prisma.car.findMany(),
  };
};
