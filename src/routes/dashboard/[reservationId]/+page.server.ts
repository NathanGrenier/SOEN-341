import { prisma } from "$lib/db/client";
import { redirect } from "@sveltejs/kit";
// import type { Actions } from "./$types";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    return redirect(300, "/auth/login");
  }

  const reservation = await prisma.reservation.findFirst({
    where: { id: Number(params.reservationId) },
  });

  return { reservation };
};
