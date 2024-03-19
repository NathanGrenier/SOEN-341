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
