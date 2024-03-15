import { UserRole } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db/client";
import { error, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { licenseNumberFormats } from "$lib/licenses";

const CheckInFormSchema = z.object({
  reservationId: z.coerce.number(),
  confirmName: z.literal("true"),
  confirmPhoto: z.literal("true"),
  confirmExpiry: z.literal("true"),
  licenseIssuingJurisdiction: z.string().regex(/^(CA|US|XX)(-[A-Z]{2})?$/),
  licenseNumber: z.string(),
  confirmDeposit: z.literal("true"),
  damageReport: z.string().optional(),
});

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || locals.user.role !== UserRole.REP) {
    return error(400, "You are not authorized to access the check-in page");
  }

  const reservationId = url.searchParams.get("res");
  if (!reservationId) return error(400, "No reservation ID provided");

  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
    select: {
      id: true,
      plannedReturnAt: true,
      pickedUpAt: true,
      checkInLicenseNumber: true,
      checkInLicenseIssuingJurisdiction: true,
      checkInReportedDamages: true,
      creditCardNumber: true,
      quotedPrice: true,
      cancelled: true,
      replacedBy: {
        select: { id: true },
      },
      holder: {
        select: {
          id: true,
          name: true,
          email: true,
          disabled: true,
        },
      },
      car: {
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          colour: true,
          photoUrl: true,
          branch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (
    !reservation ||
    reservation.cancelled ||
    reservation.replacedBy ||
    reservation.plannedReturnAt < new Date() ||
    reservation.pickedUpAt ||
    reservation.holder.disabled
  ) {
    return error(
      400,
      "This reservation does not exist or is not available for check-in.",
    );
  }

  // Redact unneeded digits of credit card number for security.
  reservation.creditCardNumber = reservation.creditCardNumber.slice(-4);

  // Turn the car colour into a string with the first letter uppercase and the rest lowercase
  reservation.car.colourStr =
    reservation.car.colour.charAt(0).toUpperCase() +
    reservation.car.colour.slice(1).toLowerCase();

  return {
    user: locals.user,
    reservation: reservation,
  };
};

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    const result = CheckInFormSchema.safeParse(data);

    // This form is all client-side validated, so return a simple error if validation failed.
    if (!result.success) return error(400, "The data submitted is not valid.");
    // If we got a string 'undefined' for the damage report, replace it with a true undefined.
    if (result.data.damageReport === "undefined")
      result.data.damageReport = undefined;
    // Validate the license number if we have a schema for licenses from that jurisdiction.
    if (licenseNumberFormats[result.data.licenseIssuingJurisdiction]) {
      const matches = result.data.licenseNumber
        .trim()
        .toUpperCase()
        .match(
          licenseNumberFormats[result.data.licenseIssuingJurisdiction].regex,
        );
      if (!matches)
        return error(
          400,
          "The license number format is invalid for that jurisdiction",
        );
      result.data.licenseNumber = matches.slice(1).join("-");
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: result.data.reservationId },
      select: {
        id: true,
        plannedReturnAt: true,
        holder: {
          select: {
            id: true,
            disabled: true,
          },
        },
        replacedBy: {
          select: {
            id: true,
          },
        },
        cancelled: true,
        checkInReportedDamages: true,
        checkInLicenseNumber: true,
        checkInLicenseIssuingJurisdiction: true,
        depositAmountTaken: true,
        pickedUpAt: true,
      },
    });

    if (
      !reservation ||
      reservation.cancelled ||
      reservation.replacedBy ||
      reservation.plannedReturnAt < new Date() ||
      reservation.pickedUpAt ||
      reservation.holder.disabled
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
        pickedUpAt: new Date(),
        checkInReportedDamages: result.data.damageReport,
        checkInLicenseNumber: result.data.licenseNumber,
        checkInLicenseIssuingJurisdiction:
          result.data.licenseIssuingJurisdiction,
        depositAmountTaken: (reservation.depositAmountTaken || 0) + 50000, // should be 0 + 50000, but just in case
      },
    });

    return redirect(302, "/check-in/success");
  },
};
