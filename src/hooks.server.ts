import { redirect } from "@sveltejs/kit";
import { validateAndRefreshSession } from "$lib/server/session";

const openRoutes = ["/", "/auth/login", "/auth/logout"];
/** @type {import('@sveltejs/kit').Handle} */
// @ts-expect-error event and resolve are any type
export const handle = async ({ event, resolve }) => {
  const session = String(event.cookies.get("SvelteState-Session") || "");
  if (!session && !openRoutes.includes(event.url.pathname)) {
    throw redirect(307, `/auth/login?destination=${event.url.pathname}`);
  }

  const result = validateAndRefreshSession(session);
  if (!result.success || event.url.pathname === "/auth/logout") {
    // Delete cookie if session invalid or route is logout
    await event.cookies.delete("SvelteState-Session", { path: "/" });
    if (!openRoutes.includes(event.url.pathname))
      throw redirect(307, `/auth/login?destination=${event.url.pathname}`);
  } else {
    event.locals.user = result.user;
    event.cookies.set("SvelteState-Session", String(result.newSession), {
      path: "/",
    });
  }

  return resolve(event);
};
