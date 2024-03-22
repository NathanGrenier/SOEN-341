import type { Car, Reservation, User } from "@prisma/client";
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

export async function createEntity(
  entityName: string,
  finalizedForm: FormData,
) {
  try {
    const createResponse = await fetch(`/admin?/create${entityName}`, {
      method: "POST",
      body: finalizedForm,
    });

    if (!createResponse.ok) {
      throw new Error(`There was an error creating ${entityName}`);
    }

    await createResponse.json();

    return {
      message: `Succesfully created ${entityName}`,
      classes: "variant-filled-success",
    };
  } catch (error) {
    const knownError = error as Error;
    return {
      message: knownError.message,
      background: "variant-filled-error",
    };
  }
}

export async function updateEntity(
  entityName: string,
  finalizedForm: FormData,
) {
  try {
    const updateResponse = await fetch(`/admin?/update${entityName}`, {
      method: "POST",
      body: finalizedForm,
    });

    if (!updateResponse.ok) {
      throw new Error("There was an error updating the entity");
    }

    await updateResponse.json();

    return {
      message: `${entityName} has been successfully updated`,
      classes: "variant-filled-success",
    };
  } catch (error) {
    const knownError = error as Error;
    return {
      message: knownError.message,
      background: "variant-filled-error",
    };
  }
}

export async function fetchEntities(entityName: string) {
  try {
    // Fetch all entities
    const blankFormData = new FormData();
    blankFormData.append("message", `Fetching all ${entityName}`);
    const fetchResponse = await fetch(`?/getAll${entityName}s`, {
      method: "POST",
      body: blankFormData,
    });

    if (!fetchResponse.ok) {
      throw new Error(`There was an error fetching ${entityName}`);
    }

    const fetchedData = await fetchResponse.json();

    // Process fetched data
    const jsonData = JSON.parse(fetchedData.data);
    const fetchedEntities = jsonData.map((item: string) => JSON.parse(item));
    const flattenedEntities = fetchedEntities.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: string | any[], current: any) => acc.concat(current),
      [],
    );

    return {
      flattenedEntities,
      message: `Successfully fetched ${entityName}s`,
      background: "variant-filled-success",
    };
  } catch (error) {
    const knownError = error as Error;
    return {
      message: knownError.message,
      background: "variant-filled-error",
    };
  }
}

export async function fetchEntityById(
  entityName: string,
  id: number,
): Promise<{
  entity?: Car | Reservation | User;
  message: string;
  background: string;
}> {
  try {
    const formData = new FormData();

    formData.append(`${entityName.toLowerCase()}Id`, id.toString());

    const fetchResponse = await fetch(`?/get${entityName}ById`, {
      method: "POST",
      body: formData,
    });
    if (!fetchResponse.ok) {
      throw new Error(
        `There was an error fetching ${entityName} with ID ${id}`,
      );
    }

    const fetchedData = await fetchResponse.json();
    const jsonData = JSON.parse(fetchedData.data);
    const fetchedEntity = JSON.parse(jsonData);

    return {
      entity: fetchedEntity,
      message: `Successfully fetched ${entityName} with ID ${id}`,
      background: "variant-filled-success",
    };
  } catch (error) {
    const knownError = error as Error;
    return {
      message: knownError.message,
      background: "variant-filled-error",
    };
  }
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
