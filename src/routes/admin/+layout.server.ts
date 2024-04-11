import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import { UserRole } from "@prisma/client";
//import { list } from "$lib/server/blob";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(300, "/auth/login");
  }
  if (locals.user.role !== UserRole.ADMIN) {
    return error(401, `You don't have permission to access this page.`);
  }
  // This works, but it isn't used and will run up the S3 bill
  // const { blobs } = await list();
  // return { blobs };
};
