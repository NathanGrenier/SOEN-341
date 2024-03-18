<script lang="ts">
  import type { Car } from "@prisma/client";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import flatpickr from "flatpickr";
  import { onMount } from "svelte";
  import "flatpickr/dist/themes/dark.css";
  import type { Reservation } from "@prisma/client";

  export let car: Car & { reservations: Reservation[] };
  export let timezone: string;

  const modalStore = getModalStore();

  let ref: Node;
  let startDate: string;
  let endDate: string;

  let disabledBookButton = true;

  let disable = car.reservations
    .filter((reservation: Reservation) => !reservation.cancelled)
    .map((reservation) => {
      console.log(reservation.plannedDepartureAt);
      console.log(
        convertDateToUserTimezone(reservation.plannedDepartureAt, timezone) +
          " haha",
      );
      return {
        from: convertDateToUserTimezone(
          reservation.plannedDepartureAt,
          timezone,
        ),
        to: convertDateToUserTimezone(reservation.plannedReturnAt, timezone),
      };
    });

  onMount(() => {
    flatpickr(ref, {
      allowInput: true,
      clickOpens: true,
      mode: "range",
      inline: true,
      minDate: new Date(),
      disable: disable,
      onChange: (selectedDates) => {
        if (selectedDates.length !== 2) {
          disabledBookButton = true;
          return;
        }
        startDate = formatDateToYYYYMMDD(selectedDates[0]);
        endDate = formatDateToYYYYMMDD(selectedDates[1]);
        disabledBookButton = false;
      },
    });
  });

  function convertDateToUserTimezone(
    date: Date,
    originalTimezone: string,
  ): Date {
    const dateStringInOriginalTimezone = date.toLocaleString("en-US", {
      timeZone: originalTimezone,
    });

    const userDate = new Date(dateStringInOriginalTimezone);

    return userDate;
  }

  function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function redirectToBooking(): void {
    const dateRange = startDate + "~" + endDate;
    const redirectUrl = `/reserve?carId=${car.id}&dateRange=${dateRange}&branchId=${car.branchId}`;
    window.location.href = redirectUrl;
  }
</script>

{#if $modalStore[0]}
  <div class="card flex flex-col justify-between p-4">
    <div class="grid grid-cols-2 gap-x-4">
      <div class="my-auto w-96 space-y-4">
        <img
          alt="Car"
          src={car.photoUrl || "https://placehold.co/600x400"}
          class="mx-auto block w-96 rounded" />
        <div class="text-center">
          <h2 class="text-lg font-semibold">{car.make} {car.model}</h2>
        </div>
        <p><strong>Year:</strong> {car.year}</p>
        <p><strong>Colour:</strong> {car.colour}</p>
        <p><strong>Seats:</strong> {car.seats}</p>
        <p><strong>Daily Price:</strong> ${car.dailyPrice / 100}</p>
        <p>{car.description}</p>
      </div>
      <div class="my-auto space-y-4 p-4">
        <div class="flex justify-center">
          <h3 class="h3">Select a Date Range</h3>
        </div>
        <div class="ml-5 space-y-4">
          <input class="ml-12 block bg-secondary-800" bind:this={ref} />
        </div>
        <button
          class="btn mx-auto mt-2 block rounded bg-primary-500 px-4 py-2"
          on:click={redirectToBooking}
          disabled={disabledBookButton}>Book Now</button>
      </div>
    </div>
  </div>
{/if}
