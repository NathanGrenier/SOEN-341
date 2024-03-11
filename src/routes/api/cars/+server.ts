import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

// GET operation to fetch all cars
export async function GET(): Promise<Response> {
  try {
    const cars = await prisma.car.findMany();
    return json({ cars });
  } catch (error) {
    return json({ status: 500, body: { message: "Internal server error" } });
  }
}

// POST operation to create a new car
export async function POST({ request }) {
  const body = await request.json();
  try {
    const newCar = await prisma.car.create({
      data: body,
    });
    return json({ success: true, car: newCar });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
