import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

// GET operation to fetch user details by ID
export async function GET({ params }) {
  try {
    const { id } = params;

    // Fetch user details by ID
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return json({ user });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}

// PUT operation to update user details
export async function PUT({ params, request }) {
  const body = await request.json();
  try {
    const { id } = params;

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });

    return json({ success: true, user: updatedUser });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}

// DELETE operation to delete a user
export async function DELETE({ params }) {
  try {
    const { id } = params;

    // Delete user by ID
    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
