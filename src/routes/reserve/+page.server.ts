import type { Branch, Car, Reservation } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { prisma } from "$lib/db/client";

function isValidDate(dateString: string | undefined) {
  if (!dateString) return false;

  const dateObject = new Date(dateString);

  return !isNaN(dateObject.getTime());
}

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    console.log(`/auth/login?destination=${url.pathname}/${url.search}`);
    return redirect(
      300,
      `/auth/login?destination=${url.pathname}/${url.search}`,
    );
  }

  const startDate = url.searchParams.get("dateRange")?.split("~")[0] || "";
  const endDate = url.searchParams.get("dateRange")?.split("~")[1] || "";
  const carId = Number(url?.searchParams?.get("carId"));
  const branchId = Number(url?.searchParams?.get("branchId"));

  if (!startDate || !endDate) {
    throw error(400, "Incorrect Date Passed");
  }

  if (!carId) {
    throw error(400, "Invalid Car");
  }

  if (!branchId) {
    throw error(400, "Invalid Branch");
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    error(403, {
      message: "Invalid Start and End Dates",
    });
  } else {
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setHours(0, 0, 0, 0);

    const today = new Date(new Date());

    if (start > end) {
      error(403, {
        message: "Start Date must be before End Date",
      });
    } else {
      if (end < today) {
        error(403, {
          message: "Dates cannot be in the past",
        });
      }
    }
  }

  const car: (Car & { reservations: Reservation[] }) | null =
    await prisma.car.findUnique({
      where: {
        id: carId,
      },
      include: {
        reservations: true,
      },
    });

  const branch: Branch | null = await prisma.branch.findUnique({
    where: {
      id: branchId,
    },
  });

  if (!car || !branch) {
    return redirect(300, "/browse-vehicles");
  }

  const conflictingReservation = car.reservations.find(
    (reservation: Reservation) => {
      if (reservation.cancelled) {
        return false;
      }

      const plannedDepartureAt = new Date(
        reservation.plannedDepartureAt,
      ).getTime();
      const plannedReturnAt = new Date(reservation.plannedReturnAt).getTime();
      const startDateTimestamp = new Date(startDate).getTime();
      const endDateTimestamp = new Date(endDate).getTime();

      const isConflict =
        (plannedDepartureAt <= endDateTimestamp &&
          plannedReturnAt >= startDateTimestamp) ||
        (plannedDepartureAt <= startDateTimestamp &&
          plannedReturnAt >= endDateTimestamp);

      return isConflict;
    },
  );

  const allCoupons = await prisma.coupon.findMany();

  const allAccessories = await prisma.accessory.findMany();

  if (conflictingReservation) {
    redirect(302, "/browse-vehicles");
  }

  return {
    startDate,
    endDate,
    currentCar: car,
    currentBranch: branch,
    allCoupons,
    allAccessories,
  };
};

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const reservationData: Omit<Reservation, "id"> = {
      carId: data.carId ? parseInt(data.carId.toString(), 10) : 0,
      holderId: data.holderId ? parseInt(data.holderId.toString(), 10) : 0,
      quotedPrice: data.quotedPrice
        ? parseInt(data.quotedPrice.toString(), 10) * 100
        : 0,
      cancelled: data.cancelled === "true",
      plannedDepartureAt: data.plannedDepartureAt
        ? new Date(data.plannedDepartureAt.toString())
        : new Date(),
      plannedReturnAt: data.plannedReturnAt
        ? new Date(data.plannedReturnAt.toString())
        : new Date(),
      pickedUpAt: data.pickedUpAt ? new Date(data.pickedUpAt.toString()) : null,
      returnedAt: data.returnedAt ? new Date(data.returnedAt.toString()) : null,
      createdAt: data.createdAt
        ? new Date(data.createdAt.toString())
        : new Date(),
      updatedAt: data.updatedAt
        ? new Date(data.updatedAt.toString())
        : new Date(),
      replacesId: null,
      creditCardNumber: data.creditCardNumber
        ? data.creditCardNumber.toString()
        : "",
      creditCardExpiry: data.creditCardExpiry
        ? data.creditCardExpiry.toString()
        : "",
      creditCardCVV: data.creditCardCVV ? data.creditCardCVV.toString() : "",
      checkInLicenseNumber: null,
      checkInLicenseIssuingJurisdiction: null,
      checkInReportedDamages: null,
      depositAmountTaken: null,
      depositAmountRefunded: null,
      amountPaid: null,
      paymentMethod: null,
      couponId: Number(data.couponId),
    };

    return await prisma.reservation.create({
      data: reservationData,
    });
  },
} satisfies Actions;
