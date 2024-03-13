import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

// GET operation to fetch reservation details by ID
export async function GET({ params }) {
  try {
    const { id } = params;

    // Fetch reservation details by ID
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return json({ reservation });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}

// PUT operation to update reservation details
export async function PUT({ params, request }) {
  const body = await request.json();
  try {
    const { id } = params;

    // Update reservation details
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });

    return json({ success: true, reservation: updatedReservation });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}

// DELETE operation to delete a reservation
export async function DELETE({ params }) {
  try {
    const { id } = params;

    // Delete reservation by ID
    await prisma.reservation.delete({
      where: {
        id: parseInt(id),
      },
    });

    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
