import { z } from "zod";
import type { Reservation } from "@prisma/client";

// Define Zod schema for Reservation
const reservationSchema = z.object({
  carId: z.number(),
  holderId: z.number(),
  replacesId: z.number().optional(),
  quotedPrice: z.number(),
  cancelled: z.boolean(),
  checkInNotes: z.string().optional(),
  checkInLicenseNumber: z.string().optional(),
  checkInLicenseIssuingJurisdiction: z.string().optional(),
  plannedDepartureAt: z.date(),
  plannedReturnAt: z.date(),
  pickedUpAt: z.date().optional(),
  returnedAt: z.date().optional(),
});

// Function to fetch all reservations
export async function getAllReservations(): Promise<Reservation[] | null> {
  try {
    const response = await fetch("/api/reservations");
    if (!response.ok) {
      throw new Error("Failed to fetch reservations");
    }
    const { reservations } = await response.json();
    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return null;
  }
}

// Function to fetch a single reservation by ID
export async function getReservationById(
  id: number,
): Promise<Reservation | null> {
  try {
    const response = await fetch(`/api/reservations/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reservation with ID ${id}`);
    }
    const { reservation } = await response.json();
    return reservation;
  } catch (error) {
    console.error(`Error fetching reservation with ID ${id}:`, error);
    return null;
  }
}

// Function to create a new reservation
export async function createReservation(
  reservationData: Partial<Reservation>,
): Promise<Reservation | null> {
  try {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });
    if (!response.ok) {
      throw new Error("Failed to create reservation");
    }
    const { newReservation } = await response.json();
    return newReservation;
  } catch (error) {
    console.error("Error creating reservation:", error);
    return null;
  }
}

// Function to update an existing reservation
export async function updateReservation(
  id: number,
  updatedData: Partial<Reservation>,
): Promise<Reservation | null> {
  try {
    const validatedData = reservationSchema.safeParse(updatedData);
    const response = await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update reservation with ID ${id}`);
    }
    const { updatedReservation } = await response.json();
    return updatedReservation;
  } catch (error) {
    console.error(`Error updating reservation with ID ${id}:`, error);
    return null;
  }
}

// Function to delete an existing reservation
export async function deleteReservation(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete reservation with ID ${id}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    return false;
  }
}
