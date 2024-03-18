import { prisma } from "$lib/db/client";
import {
  UserRole,
  type User,
  type Car,
  CarColour,
  type Reservation,
} from "@prisma/client";
import type { LayoutServerLoad } from "../$types";
import type { Actions } from "./$types";

export const load: LayoutServerLoad = async () => {
  const users = await prisma.user.findMany();
  const cars = await prisma.car.findMany();
  const reservations = await prisma.reservation.findMany();

  return {
    users: users,
    cars: cars,
    reservations: reservations,
  };
};

function parseDate(dateString: string): Date {
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const day = parseInt(dayStr);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error("Invalid date format");
  }

  return new Date(year, month, day);
}

export const actions = {
  updateUser: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const userDataToUpdate: User = {
      id: Number(data.id) || 0,
      email: data.email.toString() || "",
      name: data.name.toString() || "",
      comment: data.comment.toString() || null,
      role: UserRole[data.role as keyof typeof UserRole] || "CUSTOMER",
      passwordHash: data.passwordHash.toString() || "",
      disabled: data.disabled.toString() === "true",
      createdAt: new Date(data.createdAt.toString()),
      updatedAt: new Date(),
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: userDataToUpdate.email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: userDataToUpdate.email,
      },
      data: userDataToUpdate,
    });

    return updatedUser;
  },
  updateCar: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const carDataToUpdate: Car = {
      id: Number(data.id) || 0,
      branchId: parseInt(data.branchId.toString(), 10),
      make: data.make.toString(),
      model: data.model.toString(),
      year: parseInt(data.year.toString(), 10),
      colour: CarColour[data.colour as keyof typeof CarColour],
      seats: parseInt(data.seats.toString(), 10),
      description: data.description.toString(),
      photoUrl: data.photoUrl ? data.photoUrl.toString() : null,
      dailyPrice: parseInt(data.dailyPrice.toString(), 10),
      bookingDisabled: data.bookingDisabled.toString() === "true",
      updatedAt: new Date(),
      createdAt: parseDate(data.createdAt.toString()),
    };

    const existingCar = await prisma.car.findUnique({
      where: {
        id: carDataToUpdate.id,
      },
    });

    if (!existingCar) {
      throw new Error("Car not found");
    }

    const updatedCar = await prisma.car.update({
      where: {
        id: carDataToUpdate.id,
      },
      data: carDataToUpdate,
    });

    return updatedCar;
  },
  updateReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const reservationDataToUpdate: Reservation = {
      id: Number(data.id) || 0,
      carId: Number(data.carId),
      holderId: Number(data.holderId),
      replacesId: Number(data.replacesId) || null,
      quotedPrice: Number(data.quotedPrice) || 0,
      cancelled: Boolean(data.cancelled) === true,
      checkInNotes: data.checkInNotes.toString() || null,
      checkInLicenseNumber: data.checkInLicenseNumber.toString() || null,
      checkInLicenseIssuingJurisdiction:
        data.checkInLicenseIssuingJurisdiction.toString() || null,
      plannedDepartureAt:
        parseDate(data.plannedDepartureAt.toString()) || undefined,
      plannedReturnAt: parseDate(data.plannedReturnAt.toString()) || undefined,
      pickedUpAt: parseDate(data.pickedUpAt.toString()) || null,
      returnedAt: parseDate(data.returnedAt.toString()) || null,
      createdAt: parseDate(data.createdAt.toString()) || undefined,
      updatedAt: new Date(),
    };

    const existingReservation = await prisma.reservation.findUnique({
      where: {
        id: reservationDataToUpdate.id,
      },
    });

    if (!existingReservation) {
      throw new Error("Reservation not found");
    }

    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationDataToUpdate.id,
      },
      data: reservationDataToUpdate,
    });

    return updatedReservation;
  },
  createUser: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const userDataToCreate: User = {
      id: Number(data.id) || 0,
      email: data.email.toString() || "",
      name: data.name.toString() || "",
      comment: data.comment.toString() || null,
      role: UserRole[data.role as keyof typeof UserRole] || "CUSTOMER",
      passwordHash: data.passwordHash.toString() || "",
      disabled: data.disabled.toString() === "true",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newUser = await prisma.user.create({
      data: userDataToCreate,
    });

    return newUser;
  },
  createCar: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const carDataToCreate: Car = {
      id: Number(data.id) || 0,
      branchId: parseInt(data.branchId.toString(), 10),
      make: data.make.toString(),
      model: data.model.toString(),
      year: parseInt(data.year.toString(), 10),
      colour: CarColour[data.colour as keyof typeof CarColour],
      seats: parseInt(data.seats.toString(), 10),
      description: data.description.toString(),
      photoUrl: data.photoUrl ? data.photoUrl.toString() : null,
      dailyPrice: parseInt(data.dailyPrice.toString(), 10),
      bookingDisabled: data.bookingDisabled.toString() === "true",
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const newCar = await prisma.car.create({
      data: carDataToCreate,
    });

    return newCar;
  },
  createReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const reservationDataToCreate: Reservation = {
      id: Number(data.id) || 0,
      carId: Number(data.carId),
      holderId: Number(data.holderId),
      replacesId: Number(data.replacesId) || null,
      quotedPrice: Number(data.quotedPrice) || 0,
      cancelled: Boolean(data.cancelled) === true,
      checkInNotes: data.checkInNotes.toString() || null,
      checkInLicenseNumber: data.checkInLicenseNumber.toString() || null,
      checkInLicenseIssuingJurisdiction:
        data.checkInLicenseIssuingJurisdiction.toString() || null,
      plannedDepartureAt:
        parseDate(data.plannedDepartureAt.toString()) || undefined,
      plannedReturnAt: parseDate(data.plannedReturnAt.toString()) || undefined,
      pickedUpAt: parseDate(data.pickedUpAt.toString()) || null,
      returnedAt: parseDate(data.returnedAt.toString()) || null,
      createdAt: parseDate(data.createdAt.toString()) || undefined,
      updatedAt: new Date(),
    };

    const newReservation = await prisma.reservation.create({
      data: reservationDataToCreate,
    });

    return newReservation;
  },
  deleteUser: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(data.id),
      },
    });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    const newUser = await prisma.user.delete({
      where: {
        id: Number(data.id),
      },
    });

    return newUser;
  },
  deleteReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const existingReservation = await prisma.reservation.findUnique({
      where: {
        id: Number(data.id),
      },
    });

    if (!existingReservation) {
      throw new Error("Reservation does not exist");
    }

    const newUser = await prisma.reservation.delete({
      where: {
        id: Number(data.id),
      },
    });

    return newUser;
  },
  deleteCar: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const existingCar = await prisma.car.findUnique({
      where: {
        id: Number(data.id),
      },
    });

    if (!existingCar) {
      throw new Error("Car does not exist");
    }

    const newUser = await prisma.car.delete({
      where: {
        id: Number(data.id),
      },
    });

    return newUser;
  },
} satisfies Actions;
