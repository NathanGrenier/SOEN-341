import { PaymentMethod, UserRole } from "@prisma/client";
import { z } from "zod";
import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/db/client";

const CheckOutFormSchema = z.object({
  reservationId: z.coerce.number(),
  paymentMethod: z.enum(["CARD_ON_FILE", "CASH"]),
});

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || locals.user.role !== UserRole.REP) {
    return error(400, "You are not authorized to access the check-out page");
  }

  const reservationId = url.searchParams.get("res");
  if (!reservationId) return error(400, "No reservation ID provided");

  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
    select: {
      id: true,
      pickedUpAt: true,
      returnedAt: true,
      cancelled: true,
      creditCardNumber: true,
      checkInReportedDamages: true,
      depositAmountTaken: true,
      depositAmountRefunded: true,
      quotedPrice: true,
      replacedBy: {
        select: { id: true },
      },
      holder: {
        select: {
          id: true,
          name: true,
        },
      },
      car: {
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          colour: true,
          branch: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (
    !reservation ||
    reservation.cancelled ||
    reservation.replacedBy ||
    !reservation.pickedUpAt ||
    reservation.returnedAt
  ) {
    return error(
      400,
      "This reservation does not exist or is not available for check-out",
    );
  }

  reservation.creditCardNumber = reservation.creditCardNumber.slice(-4);
  return {
    user: locals.user,
    reservation,
  };
};

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    const result = CheckOutFormSchema.safeParse(data);

    // This form is just a select... not much to go wrong
    if (!result.success) {
      return error(400, "The data submitted is not valid.");
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: result.data.reservationId },
      select: {
        id: true,
        pickedUpAt: true,
        returnedAt: true,
        cancelled: true,
        depositAmountTaken: true,
        depositAmountRefunded: true,
        quotedPrice: true,
        amountPaid: true,
        paymentMethod: true,
        replacedBy: {
          select: { id: true },
        },
      },
    });

    if (
      !reservation ||
      reservation.cancelled ||
      reservation.replacedBy ||
      !reservation.pickedUpAt ||
      reservation.returnedAt
    ) {
      return error(
        400,
        "This reservation does not exist or is not available for check-in.",
      );
    }

    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        returnedAt: new Date(),
        depositAmountRefunded:
          (reservation.depositAmountTaken || 0) -
          (reservation.depositAmountRefunded || 0),
        amountPaid: reservation.quotedPrice - (reservation.amountPaid || 0),
        paymentMethod: PaymentMethod[result.data.paymentMethod],
      },
    });

    return redirect(302, "/check-out/success");
  },
};
