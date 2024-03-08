import { prisma } from "$lib/db/client";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(300, "/auth/login");
  }
  const userReserverations = await prisma.reservation.findMany({
    where: {
      holderId: locals.user.id,
    },
    select: {
      id: true,
      car: true,
      quotedPrice: true,
      cancelled: true,
      plannedDepartureAt: true,
      plannedReturnAt: true,
      pickedUpAt: true,
      returnedAt: true,
    },
  });

  return {
    userReserverations,
  };
};

export const actions = {
  setPaginationAmount: async ({ params }) => {
    return {
      paginationAmount: params,
    };
  },
} satisfies Actions;
