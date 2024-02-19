import bcrypt from "bcrypt";
import { prisma } from "$lib/db/client";
import { fail, redirect } from "@sveltejs/kit";
import { createSession } from "$lib/server/session";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const form = await event.request.formData();
    const email = String(form.get("email") || "");
    const passwordRaw = String(form.get("password") || "");
    if (!email) {
      return fail(400, { email, missing: true });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (
      !user ||
      user.disabled ||
      !(await bcrypt.compare(passwordRaw, user.passwordHash))
    ) {
      return fail(400, { email, incorrect: true });
    }

    event.cookies.set(
      "SvelteState-Session",
      createSession({
        sub: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      { path: "/" },
    );

    // Prevent open redirect, only allow destinations starting with /
    if ((event.url.searchParams.get("destination") || "").indexOf("/") == 0) {
      return redirect(302, event.url.searchParams.get("destination") || "/");
    } else {
      return redirect(302, "/");
    }
  },
};
