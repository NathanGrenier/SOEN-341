import { prisma } from "$lib/db/client";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

import type { PageServerLoad } from "./$types";
import { z } from "zod";
import { UserRole } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(300, "/auth/login");
  }

  const userReserverations = await prisma.reservation.findMany({
    where:
      locals.user?.role === UserRole.REP ? {} : { holderId: locals.user?.id },
    select: {
      id: true,
      car: {
        select: {
          make: true,
          model: true,
          year: true,
          branch: {
            select: {
              name: true,
            },
          },
        },
      },
      replacedBy: {
        select: {
          id: true,
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

  return {
    user: locals.user,
    userReserverations: userReserverations,
  };
};

export const actions = {
  cancelReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const cancelReservationSchema = z.object({
      id: z.string().transform((value) => {
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
          throw new Error("id must be a number");
        }
        return numberValue;
      }),
    });

    const result = cancelReservationSchema.safeParse(data);
    if (!result.success) {
      return error(400, {
        message:
          "No reservation id was provided. Please try again with a valid reservation id.",
      });
    }
    const reservationId = result.data.id;

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { cancelled: true },
    });
  },
} satisfies Actions;
