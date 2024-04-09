import { prisma } from "$lib/db/client";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { CarColour, CarType, type Prisma } from "@prisma/client";

function stringToEnum<T>(str: string, enumObj: T): T[keyof T] | undefined {
  for (const key in enumObj) {
    if (
      Object.prototype.hasOwnProperty.call(enumObj, key) &&
      enumObj[key as keyof T] === str
    ) {
      return enumObj[key as keyof T];
    }
  }
  return undefined;
}

export const load: PageServerLoad = async ({ locals, url }) => {
  const branchId = url.searchParams.get("branchId");

  let cars;

  if (branchId) {
    cars = await prisma.car.findMany({
      where: {
        branchId: parseInt(branchId),
        bookingDisabled: false,
      },
      include: { reservations: true },
    });
  } else {
    cars = await prisma.car.findMany({
      where: {
        bookingDisabled: false,
      },
      include: { reservations: true },
    });
  }

  const branches = await prisma.branch.findMany({ where: { disabled: false } });

  const likedVehicles = await prisma.like.findMany({
    where: { userId: locals.user?.id },
  });

  const likedVehiclesIDs: number[] = likedVehicles.map((obj) => obj.carId);

  return {
    cars,
    branches,
    branchId,
    likedVehiclesIDs,
  };
};

export const actions = {
  searchCars: async ({ locals, request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const whereClause: Prisma.CarWhereInput = {};

    whereClause.bookingDisabled = false;

    if (data.branchId !== undefined && +data.branchId.toString() !== -1) {
      whereClause.branchId = { equals: +data.branchId };
    } else {
      delete whereClause.branchId;
    }

    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      whereClause.dailyPrice = {
        gte: +data.minPrice * 100,
        lte: +data.maxPrice * 100,
      };
    } else if (data.minPrice !== undefined) {
      whereClause.dailyPrice = {
        gte: +data.minPrice * 100,
      };
    } else if (data.maxPrice !== undefined) {
      whereClause.dailyPrice = {
        lte: +data.maxPrice * 100,
      };
    }

    if (!data.carsize || data.carsize === "No Specific Size") {
      delete whereClause.carsize;
    } else {
      whereClause.carsize = {
        equals: stringToEnum(data.carsize.toString(), CarType),
      };
    }

    if (!data.colour || data.colour === "No Specific Color") {
      delete whereClause.colour;
    } else {
      whereClause.colour = {
        equals: stringToEnum(data.colour.toString(), CarColour),
      };
    }

    let cars = await prisma.car.findMany({
      where: whereClause,
      include: { reservations: true },
    });

    if (data.startDate && data.endDate) {
      const filteredCars = cars.filter((car) => {
        const conflict = car.reservations.some((reservation) => {
          if (reservation.cancelled) {
            return false;
          }

          const reservationStartDate = new Date(
            reservation.plannedDepartureAt,
          ).toISOString();
          const reservationEndDate = new Date(
            reservation.plannedReturnAt,
          ).toISOString();
          const startDateObj = data.startDate.toString();
          const endDateObj = data.endDate.toString();

          return (
            (startDateObj >= reservationStartDate &&
              startDateObj <= reservationEndDate) ||
            (endDateObj >= reservationStartDate &&
              endDateObj <= reservationEndDate) ||
            (startDateObj <= reservationStartDate &&
              endDateObj >= reservationEndDate)
          );
        });

        return !conflict;
      });

      cars = filteredCars;
    }

    if (data.filterFavorite && data.filterFavorite.toString() === "true") {
      const likedCars = await prisma.like.findMany({
        where: {
          userId: locals.user?.id,
        },
      });

      const likedCarIds = likedCars.map((likedCar) => likedCar.carId);

      cars = cars.filter((car) => likedCarIds.includes(car.id));
    }

    return JSON.stringify(cars);
  },
  setLikeStatus: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    if (data.status === "Favorite") {
      await prisma.like.create({
        data: {
          userId: Number(data.userId),
          carId: Number(data.carId),
        },
      });
    } else {
      const likeToDelete = await prisma.like.findFirst({
        where: { userId: Number(data.userId), carId: Number(data.carId) },
      });

      if (!likeToDelete) return "Could not unfavorite";

      await prisma.like.delete({
        where: { id: likeToDelete.id },
      });
    }

    return "Success";
  },
} satisfies Actions;
