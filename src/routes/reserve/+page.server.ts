import type { Branch, Car, Reservation } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/db/client";

function isValidDate(dateString: string | undefined) {
  if (!dateString) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
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

  const car: Car | null = await prisma.car.findUnique({
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

  if (conflictingReservation) {
    redirect(302, "/browse-vehicles");
  }

  return {
    startDate: startDate,
    endDate: endDate,
    currentCar: car,
    currentBranch: branch,
  };
};
