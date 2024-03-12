import { getAllCars } from "$lib/controllers/carController.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const cars = await getAllCars();

  return {
    props: { cars },
  };
};
