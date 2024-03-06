import bcrypt from "bcrypt";
import { prisma } from "$lib/db/client";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { validateResetToken, createSession } from "$lib/server/session";

const PasswordResetSchema = z.object({
  passwordRaw: z.string(),
  confirmPassword: z.string(),
});

export const actions = {
  default: async ({ cookies, request, url }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    const result = PasswordResetSchema.safeParse(data);

    if (!result.success) {
      // On strings alone, this case shouldn't really happen.
      return fail(400, {
        error: "Invalid Request",
        errorMessage: "Please check the data entered and try again.",
      });
    }

    const userId = validateResetToken(url.searchParams.get("token") || "");

    if (!userId) {
      return fail(400, {
        error: "Invalid Reset Token",
        errorMessage:
          "The password reset link you used is no longer valid. Please request a new one.",
      });
    }

    if (result.data.passwordRaw !== result.data.confirmPassword) {
      return fail(400, {
        error: "Password Mismatch",
        errorMessage:
          'The "Password" and "Confirm Password" you entered do not match.',
      });
    }

    if (
      result.data.passwordRaw.length < 8 ||
      !result.data.passwordRaw.match(/[a-z]/) ||
      !result.data.passwordRaw.match(/[A-Z]/) ||
      !result.data.passwordRaw.match(/[0-9]/)
    ) {
      return fail(400, {
        error: "Password Complexity",
        errorMessage:
          "Please ensure your password meets the complexity requirements.",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.disabled) {
      return fail(400, {
        error: "Account Disabled",
        errorMessage:
          "Your account is disabled. Contact us for more information.",
      });
    }

    const passwordHash = await bcrypt.hash(result.data.passwordRaw, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: passwordHash,
      },
    });

    // Log in the user
    cookies.set(
      "SvelteState-Session",
      createSession({
        sub: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      { path: "/" },
    );

    return redirect(302, "/");
  },
};
