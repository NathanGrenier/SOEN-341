import { getModeUserPrefers } from "@skeletonlabs/skeleton";

export function centsToDollars(price: number): string {
  // Divide by 100 to convert cents to dollars
  return `$${(price / 100).toFixed(2)}`;
}

export function formatDbReservationDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function setFlatpickrTheme() {
  if (getModeUserPrefers()) {
    await import("flatpickr/dist/themes/material_blue.css");
  } else {
    await import("flatpickr/dist/themes/dark.css");
  }
}

export function getReservationDuration(startDate: Date, endDate: Date): number {
  return Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}
