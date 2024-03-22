import { prisma } from "$lib/db/client";
import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { z } from "zod";

import type { PageServerLoad } from "./$types";
import { getReservationDuration } from "$lib/utils";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    return redirect(300, "/auth/login");
  }

  const reservation = await prisma.reservation.findFirst({
    where: { id: Number(params.reservationId) },
    select: {
      id: true,
      holderId: true,
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
      plannedDepartureAt: true,
      plannedReturnAt: true,
      quotedPrice: true,
      cancelled: true,
      replacedBy: true,
      replaces: true,
      pickedUpAt: true,
      returnedAt: true,
    },
  });

  if (!reservation) {
    return error(404, { message: "Reservation not found." });
  }

  if (locals.user.id !== reservation.holderId) {
    return error(403, {
      message: "You are not authorized to access this page.",
    });
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
  modifyReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const modifyReservationSchema = z.object({
      reservationDates: z
        .string()
        .refine(
          (value) =>
            !isNaN(Date.parse(value.split(" to ")[0])) &&
            !isNaN(Date.parse(value.split(" to ")[1])),
          {
            message: "reservationDates must be a valid datetime string",
          },
        ),
      timezoneOffset: z.string().refine((value) => !isNaN(Number(value)), {
        message: "timezoneOffset must be a valid number",
      }),
      reservationId: z.string().refine((value) => !isNaN(Number(value)), {
        message: "reservationId must be a valid number",
      }),
    });

    const result = modifyReservationSchema.safeParse(data);
    if (!result.success) {
      return error(400, {
        message: result.error.errors[0].message,
      });
    }

    const { reservationDates, timezoneOffset, reservationId } = result.data;
    const [plannedDepartureAt, plannedReturnAt] = reservationDates
      .split(" to ")
      .map(
        (date) =>
          new Date(
            new Date(`${date.split(" ")[0]}T${date.split(" ")[1]}`).getTime() -
              Number(timezoneOffset),
          ),
      );

    await prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.reservation.update({
        where: { id: Number(reservationId) },
        data: {
          cancelled: true,
        },
        select: {
          id: true,
          carId: true,
          holderId: true,
          paymentMethod: true,
          creditCardNumber: true,
          creditCardCVV: true,
          creditCardExpiry: true,
          car: {
            select: {
              dailyPrice: true,
            },
          },
        },
      });

      await prisma.reservation.create({
        data: {
          replacesId: updatedReservation.id,
          holderId: updatedReservation.holderId,
          carId: updatedReservation.carId,
          plannedDepartureAt,
          plannedReturnAt,
          quotedPrice:
            updatedReservation.car.dailyPrice *
            getReservationDuration(plannedDepartureAt, plannedReturnAt),
          paymentMethod: updatedReservation.paymentMethod,
          creditCardNumber: updatedReservation.creditCardNumber,
          creditCardExpiry: updatedReservation.creditCardExpiry,
          creditCardCVV: updatedReservation.creditCardCVV,
        },
      });
    });
  },
} satisfies Actions;
