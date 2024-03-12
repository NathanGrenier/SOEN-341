import { prisma } from "$lib/db/client";
import { json } from "@sveltejs/kit";

export async function GET(): Promise<Response> {
  const branches = await prisma.branch.findMany();
  return json({
    branches,
  });
}

export async function POST({ request }) {
  const body = await request.json();
  try {
    const newBranch = await prisma.branch.create({
      data: body,
    });

    return json({ success: true, branch: newBranch });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
}
