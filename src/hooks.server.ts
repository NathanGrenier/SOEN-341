import { redirect } from "@sveltejs/kit";
import { validateAndRefreshSession } from "$lib/server/session";
import type { Handle } from "@sveltejs/kit";

const openRoutes = [
  "/",
  "/auth/login",
  "/auth/logout",
  "/auth/register",
  "/auth/request-reset",
  "/auth/reset",
  "/browse-vehicles",
  "/find-branch",
  "/contact-us",
  "/our-policies"
]; // Routes that don't need the user to be logged in

export const handle: Handle = async ({ event, resolve }) => {
  const session = String(event.cookies.get("SvelteState-Session") || "");
  if (!session && !openRoutes.includes(event.url.pathname)) {
    throw redirect(302, `/auth/login?destination=${event.url.pathname}`);
  }

  const result = validateAndRefreshSession(session);
  if (!result.success || event.url.pathname === "/auth/logout") {
    // Delete cookie if session invalid or route is logout
    await event.cookies.delete("SvelteState-Session", { path: "/" });
    if (!openRoutes.includes(event.url.pathname))
      throw redirect(302, `/auth/login?destination=${event.url.pathname}`);
  } else {
    event.locals.user = result.user;
    event.cookies.set("SvelteState-Session", String(result.newSession), {
      path: "/",
    });
  }

  return resolve(event);
};
