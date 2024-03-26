import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { prisma } from "$lib/db/client";
import { z } from "zod";
import type { Car, Reservation, User } from "@prisma/client";
import { CarColour, UserRole } from "@prisma/client";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { getFirebaseApp } from "$lib/db/firestore";

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
  const allCars = await prisma.car.findMany();

  const allReservations = await prisma.reservation.findMany();

  const allUsers = await prisma.user.findMany();

  return { allCars, allReservations, allUsers };
};

export const actions = {
  // upload: async ({ request }) => {
  //   const form = await request.formData();
  //   const file = form.get("file") as File;

  //   if (!file) {
  //     throw error(400, { message: "No file to upload." });
  //   }

  //   const { url, downloadUrl } = await put(file.name, file, {
  //     access: "public",
  //   });
  //   return { uploaded: { url, downloadUrl } }; // You would add the download url to the car object in the postgress database
  // },
  createReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const reservationData: Omit<Reservation, "id"> = {
      carId: data.carId ? Number(data.carId.toString()) : 0,
      holderId: data.holderId ? Number(data.holderId.toString()) : 0,
      quotedPrice: data.quotedPrice ? Number(data.quotedPrice.toString()) : 0,
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
      checkInLicenseNumber: null,
      checkInLicenseIssuingJurisdiction: null,
      creditCardNumber: "",
      creditCardExpiry: "",
      creditCardCVV: "",
      checkInReportedDamages: null,
      depositAmountTaken: null,
      depositAmountRefunded: null,
      amountPaid: null,
      paymentMethod: null,
    };

    return await prisma.reservation.create({
      data: reservationData,
    });
  },
  createCar: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const carData: Omit<Car, "id"> = {
      branchId: data.branchId ? Number(data.branchId.toString()) : 0,
      make: data.make.toString() || "",
      model: data.model.toString() || "",
      year: data.year ? Number(data.year.toString()) : 0,
      colour:
        stringToEnum(data.colour.toString(), CarColour) || CarColour.BLACK,
      seats: data.seats ? Number(data.seats.toString()) : 0,
      description: data.description.toString() || "",
      photoUrl: data.photoUrl.toString() || null,
      dailyPrice: data.dailyPrice ? Number(data.dailyPrice.toString()) : 0,
      bookingDisabled: data.bookingDisabled === "true",
      createdAt: data.createdAt
        ? new Date(data.createdAt.toString())
        : new Date(),
      updatedAt: data.updatedAt
        ? new Date(data.updatedAt.toString())
        : new Date(),
    };

    return await prisma.car.create({
      data: carData,
    });
  },
  createUser: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const userData: Omit<User, "id"> = {
      email: data.email.toString() || "",
      name: data.name.toString() || "",
      comment: data.comment.toString() || null,
      role: stringToEnum(data.role.toString(), UserRole) || UserRole.CUSTOMER,
      passwordHash: data.passwordHash.toString() || "",
      disabled: data.disabled === "true",
      createdAt: data.createdAt
        ? new Date(data.createdAt.toString())
        : new Date(),
      updatedAt: data.updatedAt
        ? new Date(data.updatedAt.toString())
        : new Date(),
    };

    return await prisma.user.create({
      data: userData,
    });
  },
  updateReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    const reservationId = Number(data.reservationId.toString()) || -1;

    console.log(reservationId);

    if (reservationId === -1) throw error(404, "Reservation does not exist");

    const reservationDataToUpdate: Partial<Omit<Reservation, "id">> = {
      carId: data.carId ? Number(data.carId.toString()) : undefined,
      holderId: data.holderId ? Number(data.holderId.toString()) : undefined,
      quotedPrice: data.quotedPrice
        ? Number(data.quotedPrice.toString())
        : undefined,
      cancelled: data.cancelled === "true",
      plannedDepartureAt: data.plannedDepartureAt
        ? new Date(data.plannedDepartureAt.toString())
        : undefined,
      plannedReturnAt: data.plannedReturnAt
        ? new Date(data.plannedReturnAt.toString())
        : undefined,
      pickedUpAt: data.pickedUpAt ? new Date(data.pickedUpAt.toString()) : null,
      returnedAt: data.returnedAt ? new Date(data.returnedAt.toString()) : null,
      updatedAt: new Date(),
    };

    const filteredReservationData = Object.fromEntries(
      Object.entries(reservationDataToUpdate).filter(
        ([, v]) => v !== undefined,
      ),
    ) as Partial<Omit<Reservation, "id">>;

    return await prisma.reservation.update({
      where: { id: reservationId },
      data: filteredReservationData,
    });
  },
  updateCar: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const updateCarSchema = z.object({
      carId: z
        .string()
        .refine((value) => !Number.isNaN(value), {
          message: "reservationDates must be a valid datetime string",
        })
        .transform(Number),
      make: z.string(),
      model: z.string(),
      year: z
        .string()
        .refine((value) => !Number.isNaN(value), {
          message: "year must be a number",
        })
        .transform(Number),
      colour: z
        .string()
        .refine((value) => CarColour[value as CarColour] !== undefined, {
          message: "Invalid car colour",
        })
        .transform((value) => value as CarColour),
      seats: z
        .string()
        .refine((value) => !Number.isNaN(value), {
          message: "seats must be a number",
        })
        .transform(Number),
      description: z.string(),
      photo: z
        .any()
        .optional()
        .refine((value) => value instanceof File, {
          message: "Must be a file",
        })
        .transform((value) =>
          value.size === 0 ? (value = undefined) : (value as File),
        ),
      photoUrl: z.string().optional(),
      dailyPrice: z
        .string()
        .refine((value) => !Number.isNaN(value), {
          message: "dailyPrice must be a number",
        })
        .transform(Number),
      bookingDisabled: z
        .string()
        .refine((value) => value === "true" || value === "false", {
          message:
            "bookingDisabled must be a boolean (either 'true' or 'false')",
        })
        .transform((value) => value === "true"),
      branchId: z
        .string()
        .refine((value) => !Number.isNaN(value), {
          message: "branchId must be a number",
        })
        .transform(Number),
    });

    const result = updateCarSchema.safeParse(data);

    if (!result.success) {
      console.log(result.error);
      return error(400, {
        message: result.error.errors[0].message,
      });
    }

    const { carId, photo, photoUrl: oldPhotoUrl, ...car } = result.data; // Don't include the carId in the car object

    // Handle photo upload
    let photoUrl: string | undefined = undefined;

    const app = await getFirebaseApp();
    const storage = getStorage(app);

    if (photo) {
      const carImageRef = ref(storage, `images/car/${photo.name}`);

      const uploadTask = uploadBytesResumable(carImageRef, photo);

      photoUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (err) => {
            switch (err.code) {
              case "storage/unauthorized":
                reject("User doesn't have permission to access the object");
                break;
              case "storage/canceled":
                reject("User canceled the upload");
                break;
              case "storage/unknown":
                reject("Unknown storage error occurred");
                break;
            }
          },
          async () => {
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`downloadURL: ${downloadURL}`);
            resolve(downloadURL);
          },
        );
      });
    }

    if (photoUrl) {
      // Delete the old car photo
      if (oldPhotoUrl) {
        const oldPhotoRef = ref(storage, oldPhotoUrl);
        // Delete the file
        try {
          await deleteObject(oldPhotoRef);
          console.log(`Deleted photo with URL: ${oldPhotoUrl}`);
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    }

    return await prisma.car.update({
      where: { id: carId },
      data: { ...car, photoUrl },
    });
  },
  updateUser: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const userId = Number(data.userId.toString());

    if (userId === 10) throw error(404, "User not found");

    const userDataToUpdate: Partial<Omit<User, "id">> = {
      email: data.email.toString() || undefined,
      name: data.name.toString() || undefined,
      comment: data.comment.toString() || undefined,
      role: stringToEnum(data.role.toString(), UserRole) || undefined,
      passwordHash: data.passwordHash.toString() || undefined,
      disabled: data.disabled === "true",
      updatedAt: new Date(),
    };

    const filteredUserData = Object.fromEntries(
      Object.entries(userDataToUpdate).filter(([, v]) => v !== undefined),
    ) as Partial<Omit<User, "id">>;

    return await prisma.user.update({
      where: { id: userId },
      data: filteredUserData,
    });
  },
  deleteReservation: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const reservationId = Number(data.reservationId.toString());

    if (reservationId === -1) throw error(404, "Reservation not found");

    await prisma.reservation.delete({
      where: { id: reservationId },
    });

    return "Reservation deleted successfully.";
  },
  deleteCar: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const carId = Number(data.carId.toString());

    if (carId === -1) throw error(404, "Car not found");

    await prisma.car.delete({
      where: { id: carId },
    });

    return "Car deleted successfully.";
  },
  deleteUser: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const userId = Number(data.userId.toString());

    if (userId === -1) throw error(404, "USer not found");

    await prisma.user.delete({
      where: { id: userId },
    });

    return "User deleted successfully.";
  },
  getAllReservations: async () => {
    const reservations = await prisma.reservation.findMany();
    return JSON.stringify(reservations);
  },
  getAllCars: async () => {
    const cars = await prisma.car.findMany();
    return JSON.stringify(cars);
  },
  getAllUsers: async () => {
    const users = await prisma.user.findMany();
    return JSON.stringify(users);
  },
  getUserById: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(data.userId),
      },
    });

    return JSON.stringify(user);
  },
  getCarById: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const car = await prisma.car.findUnique({
      where: {
        id: Number(data.carId),
      },
    });

    return JSON.stringify(car);
  },
  getReservationById: async ({ request }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: Number(data.reservationId),
      },
    });
    return JSON.stringify(reservation);
  },
} satisfies Actions;
