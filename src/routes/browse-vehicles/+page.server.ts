import { getAllCars } from "$lib/controllers/carController.js";

export async function load() {
  const cars = await getAllCars();

  return {
    props: { cars },
  };
}
