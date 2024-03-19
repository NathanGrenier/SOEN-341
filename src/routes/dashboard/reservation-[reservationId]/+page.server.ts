import { prisma } from "$lib/db/client";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

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
          dailyPrice: true,
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

  const vehicleReservations = await prisma.reservation.findMany({
    where: { carId: reservation.car.id, cancelled: false },
    select: {
      id: true,
      plannedDepartureAt: true,
      plannedReturnAt: true,
      pickedUpAt: true,
      returnedAt: true,
    },
  });

  return { reservation, vehicleReservations };
};

export const actions = {
  modifyReservation: async () => {
    // const form = await request.formData();
    // const data = Object.fromEntries(form);
    // const cancelReservationSchema = z.object({
    //   id: z.string().transform((value) => {
    //     const numberValue = Number(value);
    //     if (isNaN(numberValue)) {
    //       throw new Error("id must be a number");
    //     }
    //     return numberValue;
    //   }),
    // });
    // const result = cancelReservationSchema.safeParse(data);
    // if (!result.success) {
    //   return error(400, {
    //     message:
    //       "No reservation id was provided. Please try again with a valid reservation id.",
    //   });
    // }
    // const reservationId = result.data.id;
    // await prisma.reservation.update();
  },
} satisfies Actions;
