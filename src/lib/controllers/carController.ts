import type { Car } from "@prisma/client";

// Function to fetch all cars
export async function getAllCars(): Promise<Car[] | null> {
  try {
    const response = await fetch("/api/cars");
    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }
    const { cars } = await response.json();
    return cars;
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
    const response = await fetch("/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carData),
    });
    if (!response.ok) {
      throw new Error("Failed to create car");
    }
    const { newCar } = await response.json();
    return newCar;
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
    const response = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update car with ID ${id}`);
    }
    const { updatedCar } = await response.json();
    return updatedCar;
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
