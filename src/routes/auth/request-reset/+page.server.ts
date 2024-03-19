import { prisma } from "$lib/db/client";
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { createResetToken } from "$lib/server/session";
import { sendEmail } from "$lib/server/email/email";

const ResetRequestSchema = z.object({
  email: z.string().email(),
});

export const actions = {
  default: async ({ request, url }) => {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    const result = ResetRequestSchema.safeParse(data);

    if (!result.success) {
      return fail(400, {
        email: data.email,
        error: "Invalid Email",
        errorMessage: "Please try again with a valid email address.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user || user.disabled) {
      return { success: true };
    }

    // Todo: email this to the user
    const token = createResetToken(user.id);
    const resetLink =
      url.href.replace("/auth/request-reset", "/auth/reset?token=") + token;

    await sendEmail({
      recipientName: user.name,
      recipientEmail: user.email,
      subject: "Reset your password",
      template: "reset-password",
      vars: {
        "%name%": user.name,
        "%resetlink%": resetLink,
      },
    });

    if (process.env.EXEC_ENV === "development") {
      console.log("Password reset link: " + resetLink);
    }

    return { success: true };
  },
};
