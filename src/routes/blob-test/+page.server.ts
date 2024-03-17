import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { put, list } from "@vercel/blob";

export const load: PageServerLoad = async () => {
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
