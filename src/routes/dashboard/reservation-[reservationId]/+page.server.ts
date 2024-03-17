import { prisma } from "$lib/db/client";
import { error, redirect } from "@sveltejs/kit";
// import type { Actions } from "./$types";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    return redirect(300, "/auth/login");
  }

  const reservation = await prisma.reservation.findFirst({
    where: { id: Number(params.reservationId) },
    select: {
      id: true,
      car: {
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          photoUrl: true,
          colour: true,
          branch: {
            select: {
              name: true,
              streetAddress: true,
              city: true,
              region: true,
              country: true,
              postalCode: true,
            },
          },
        },
      },
      quotedPrice: true,
      cancelled: true,
      plannedDepartureAt: true,
      plannedReturnAt: true,
      pickedUpAt: true,
      returnedAt: true,
    },
  });

  if (!reservation) {
    return error(404, { message: "Reservation not found." });
  }

  return { reservation };
};
