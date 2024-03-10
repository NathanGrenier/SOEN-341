import { PrismaClient } from "@prisma/client";
import type { Car } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new car
export async function createCar(carData: Omit<Car, "id">): Promise<Car> {
  try {
    const newCar = await prisma.car.create({
      data: carData,
    });
    return newCar;
  } catch (error) {
    throw new Error(`Error creating car: ${error}`);
  }
}

// Get all cars
export async function getAllCars(): Promise<Car[]> {
  try {
    const cars = await prisma.car.findMany();
    return cars;
  } catch (error) {
    throw new Error(`Error getting cars: ${error}`);
  }
}

// Get car by ID
export async function getCarById(carId: number): Promise<Car | null> {
  try {
    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
    });
    return car;
  } catch (error) {
    throw new Error(`Error getting car by ID: ${error}`);
  }
}

// Update car by ID
export async function updateCar(
  carId: number,
  carData: Partial<Car>,
): Promise<Car | null> {
  try {
    const updatedCar = await prisma.car.update({
      where: {
        id: carId,
      },
      data: carData,
    });
    return updatedCar;
  } catch (error) {
    throw new Error(`Error updating car: ${error}`);
  }
}

// Delete car by ID
export async function deleteCar(carId: number): Promise<Car | null> {
  try {
    const deletedCar = await prisma.car.delete({
      where: {
        id: carId,
      },
    });
    return deletedCar;
  } catch (error) {
    throw new Error(`Error deleting car: ${error}`);
  }
}
