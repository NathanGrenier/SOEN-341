import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

// GET operation to fetch car details by ID
export async function GET({ params }) {
  try {
    const { id } = params;

    // Fetch car details by ID
    const car = await prisma.car.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        reservations: true,
      },
    });

    return json({ car });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}

// PUT operation to update car details
export async function PUT({ params, request }) {
  const body = await request.json();
  try {
    const { id } = params;

    // Update car details
    const updatedCar = await prisma.car.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });

    return json({ success: true, car: updatedCar });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}

// DELETE operation to delete a car
export async function DELETE({ params }) {
  try {
    const { id } = params;

    // Delete car by ID
    await prisma.car.delete({
      where: {
        id: parseInt(id),
      },
    });

    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
