import { getModeUserPrefers } from "@skeletonlabs/skeleton";

export function formatDate(dateString: string | number) {
  const components = dateString.toString().split("-");
  const year = parseInt(components[0]);
  const month = parseInt(components[1]);
  const day = parseInt(components[2]);

  // Validate the components
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error("Invalid date format");
  }

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseDate(dateString: string): Date {
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1; // Months in JavaScript are 0-indexed
  const day = parseInt(dayStr);

  // Validate the parsed components
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

export async function setFlatpickrTheme() {
  if (getModeUserPrefers()) {
    await import("flatpickr/dist/themes/material_blue.css");
  } else {
    await import("flatpickr/dist/themes/dark.css");
  }
}
