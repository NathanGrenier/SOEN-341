// Importing Prisma client and types
import { prisma } from "$lib/db/client";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { CarColour, CarType, type Prisma } from "@prisma/client";

// Function to convert string to enum value
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

// Server-side load function
export const load: PageServerLoad = async ({ locals, url }) => {
  const branchId = url.searchParams.get("branchId");

  let cars;

  // Fetching cars based on branchId (if provided)
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

  // Fetching branches and liked vehicles for the user
  const branches = await prisma.branch.findMany({ where: { disabled: false } });

  const likedVehicles = await prisma.like.findMany({
    where: { userId: locals.user?.id },
  });

  // Extracting car IDs of liked vehicles
  const likedVehiclesIDs: number[] = likedVehicles.map((obj) => obj.carId);

  // Returning fetched data
  return {
    cars,
    branches,
    branchId,
    likedVehiclesIDs,
  };
};

// Server-side actions
export const actions = {
  // Action to search for cars based on filter criteria
  searchCars: async ({ locals, request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    // Constructing WHERE clause for Prisma query
    const whereClause: Prisma.CarWhereInput = {};

    whereClause.bookingDisabled = false;

    // Filtering based on branchId
    if (data.branchId !== undefined && +data.branchId.toString() !== -1) {
      whereClause.branchId = { equals: +data.branchId };
    } else {
      delete whereClause.branchId;
    }

    // Filtering based on price range
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

    // Filtering based on car type
    if (!data.carsize || data.carsize === "No Specific Size") {
      delete whereClause.carsize;
    } else {
      whereClause.carsize = {
        equals: stringToEnum(data.carsize.toString(), CarType),
      };
    }

    // Filtering based on car color
    if (!data.colour || data.colour === "No Specific Color") {
      delete whereClause.colour;
    } else {
      whereClause.colour = {
        equals: stringToEnum(data.colour.toString(), CarColour),
      };
    }

    // Fetching cars based on constructed WHERE clause
    let cars = await prisma.car.findMany({
      where: whereClause,
      include: { reservations: true },
    });

    // Filtering based on date range if provided
    if (data.startDate && data.endDate) {
      // Filtering cars with reservations conflicting with provided date range
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

    // Filtering based on user's favorite cars
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
