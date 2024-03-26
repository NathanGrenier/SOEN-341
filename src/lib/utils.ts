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

export function parseDate(dateString: string): Date {
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const day = parseInt(dayStr);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error("Invalid date format");
  }

  return new Date(year, month, day);
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
