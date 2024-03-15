import { UserRole } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/db/client";

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user || locals.user.role !== UserRole.REP) {
    throw new Error("You are not authorized to access the check-in page");
  }

  const reservationId = url.searchParams.get("res");
  if (!reservationId) throw new Error("No reservation ID provided");

  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
    select: {
      id: true,
      plannedDepartureAt: true,
      plannedReturnAt: true,
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
    reservation.holder.disabled
  ) {
    throw new Error(
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
