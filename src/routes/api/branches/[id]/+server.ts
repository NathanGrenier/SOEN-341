import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const { id } = params;

  const branch = await prisma.branch.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return json({ branch });
}

export async function PUT({ params, request }) {
  const body = await request.json();
  try {
    const { id } = params;

    const updatedBranch = await prisma.branch.update({
      where: {
        id: parseInt(id),
      },
      data: body,
    });

    return json({ success: true, branch: updatedBranch });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;

    await prisma.branch.delete({
      where: {
        id: parseInt(id),
      },
    });

    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
