import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

// GET operation to fetch all reservations
export async function GET(): Promise<Response> {
  try {
    const reservations = await prisma.reservation.findMany();
    return json({ reservations });
  } catch (error) {
    return json({ status: 500, body: { message: "Internal server error" } });
  }
}

// POST operation to create a new reservation
export async function POST({ request }) {
  const body = await request.json();
  try {
    const newReservation = await prisma.reservation.create({
      data: body,
    });
    return json({ success: true, reservation: newReservation });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
