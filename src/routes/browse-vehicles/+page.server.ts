import { prisma } from "$lib/db/client";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { CarColour, type Prisma } from "@prisma/client";

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

export const load: PageServerLoad = async () => {
  async function getCars() {
    const cars = await prisma.car.findMany({
      include: { reservations: true },
    });

    if (!cars || cars.length === 0) {
      error(404, "No cars found matching query");
    }

    return cars;
  }

  const branches = await prisma.branch.findMany();

  if (!branches || branches.length === 0) {
    error(404, "No branches found");
  }

  return {
    cars: await getCars(),
    branches,
  };
};

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const whereClause: Prisma.CarWhereInput = {};

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

    if (!data.colour || data.colour === "No Specific Color") {
      delete whereClause.colour;
    } else {
      whereClause.colour = {
        equals: stringToEnum(data.colour.toString(), CarColour),
      };
    }

    const cars = await prisma.car.findMany({
      where: whereClause,
      include: { reservations: true },
    });

    const filteredCars = cars.filter((car) => {
      const conflict = car.reservations.some((reservation) => {
        if (reservation.cancelled) {
          return false;
        }

        const reservationStartDate = new Date(reservation.plannedDepartureAt);
        const reservationEndDate = new Date(reservation.plannedReturnAt);
        const startDateObj = new Date(data.startDate.toString());
        const endDateObj = new Date(data.endDate.toString());

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

    return JSON.stringify(filteredCars);
  },
} satisfies Actions;
