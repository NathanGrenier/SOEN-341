import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

// GET operation to fetch all users
export async function GET(): Promise<Response> {
  try {
    const users = await prisma.user.findMany();
    return json({ users });
  } catch (error) {
    return json({ status: 500, body: { message: "Internal server error" } });
  }
}

// POST operation to create a new user
export async function POST({ request }) {
  const body = await request.json();
  try {
    const newUser = await prisma.user.create({
      data: body,
    });
    return json({ success: true, user: newUser });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
