import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import { UserRole } from "@prisma/client";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return redirect(300, "/auth/login");
  }

  if (locals.user.role !== UserRole.ADMIN) {
    return error(401, `You don't have permission to access this page.`);
  }
};
