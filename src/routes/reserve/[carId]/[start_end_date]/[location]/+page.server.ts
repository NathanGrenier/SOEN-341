import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

function isValidDate(dateString: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

export const load: PageServerLoad = async ({ params }) => {
  const { start_end_date } = params;

  const startDate = start_end_date.split("~")[0];
  const endDate = start_end_date.split("~")[1];

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    error(403, {
      message: "Invalid Start and End Dates",
    });
  } else {
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setHours(0, 0, 0, 0);

    const today = new Date(new Date());

    console.log(start + " and " + today);

    if (start > end) {
      error(403, {
        message: "Start Date must be before End Date",
      });
    } else {
      if (end < today) {
        error(403, {
          message: "Dates cannot be in the past",
        });
      }
    }
  }

  return {
    startDate: startDate,
    endDate: endDate,
    params: params,
  };
};
