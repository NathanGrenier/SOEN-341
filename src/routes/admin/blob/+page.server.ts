import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import type { Actions } from "./$types";
import { list, put } from "$lib/server/blob";

export const load: LayoutServerLoad = async () => {
  const { blobs } = await list();
  return { blobs };
};

export const actions = {
  upload: async ({ request }) => {
    const form = await request.formData();
    const file = form.get("file") as File;
    if (!file) {
      throw error(400, { message: "No file to upload." });
    }
    const { url, downloadUrl } = await put(file.name, file, {
      access: "public",
    });
    return { uploaded: { url, downloadUrl } }; // You would add the download url to the car object in the postgress database
  },
} satisfies Actions;
