import { z } from "zod";
import type { Car, Reservation } from "@prisma/client";

// Define Zod schema for Car
const carSchema = z.object({
  branchId: z.number(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  colour: z.string(), // Assuming CarColour is a string type
  seats: z.number(),
  description: z.string(),
  photoUrl: z.string().optional(),
  dailyPrice: z.number(),
  bookingDisabled: z.boolean(),
});

// Function to validate car data
function validateCarData(data: unknown): Car {
  const result = carSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.map((err) => err.message).join(", "));
  }
  return result.data as Car;
}

// Function to fetch all cars
export async function getAllCars(): Promise<Car[] | null> {
  try {
    const response = await fetch("/api/cars");
    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }
    const { cars } = await response.json();
    return cars.map(validateCarData);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return null;
  }
}

// Function to fetch a single car by ID
export async function getCarById(id: number): Promise<Car | null> {
  try {
    const response = await fetch(`/api/cars/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch car with ID ${id}`);
    }
    const { car } = await response.json();
    return car;
  } catch (error) {
    console.error(`Error fetching car with ID ${id}:`, error);
    return null;
  }
}

// Function to create a new car
export async function createCar(carData: Partial<Car>): Promise<Car | null> {
  try {
    const validatedData = validateCarData(carData);
    const response = await fetch("/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    if (!response.ok) {
      throw new Error("Failed to create car");
    }
    const { newCar } = await response.json();
    return validateCarData(newCar);
  } catch (error) {
    console.error("Error creating car:", error);
    return null;
  }
}

// Function to update an existing car
export async function updateCar(
  id: number,
  updatedData: Partial<Car>,
): Promise<Car | null> {
  try {
    const validatedData = validateCarData(updatedData);
    const response = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update car with ID ${id}`);
    }
    const { updatedCar } = await response.json();
    return validateCarData(updatedCar);
  } catch (error) {
    console.error(`Error updating car with ID ${id}:`, error);
    return null;
  }
}

// Function to delete an existing car
export async function deleteCar(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/cars/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete car with ID ${id}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting car with ID ${id}:`, error);
    return false;
  }
}

// Function to fetch existing reservations for a given car
export async function getReservationsForCar(
  carId: number,
): Promise<Reservation[]> {
  try {
    const response = await fetch(`/api/cars/${carId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch existing reservations for the car");
    }
    const { car } = await response.json();
    return car.reservations;
  } catch (error) {
    console.error("Error fetching reservations for the car:", error);
    return [];
  }
}
