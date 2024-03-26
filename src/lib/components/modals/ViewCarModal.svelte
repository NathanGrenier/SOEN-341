<script lang="ts">
  import type { Car } from "@prisma/client";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import flatpickr from "flatpickr";
  import { onMount } from "svelte";
  import type { Reservation } from "@prisma/client";

  export let car: Car & { reservations: Reservation[] };

  const modalStore = getModalStore();
  const isMobileDevice = window.matchMedia("(max-width: 640px)").matches;
  const inline = !isMobileDevice;

  let ref: Node;
  let startDate: Date;
  let endDate: Date;
  let disabledBookButton = true;

  let disable = car.reservations
    .filter((reservation: Reservation) => !reservation.cancelled)
    .map((reservation) => {
      return {
        from: new Date(reservation.plannedDepartureAt),
        to: new Date(reservation.plannedReturnAt),
      };
    });

  onMount(() => {
    flatpickr(ref, {
      allowInput: true,
      clickOpens: true,
      minDate: new Date(),
      mode: "range",
      inline: inline,
      enableTime: true,
      disable: disable,
      onChange: (selectedDates) => {
        startDate = selectedDates[0];
        endDate = selectedDates[1];
        if (startDate && endDate) {
          disabledBookButton = false;
        }
      },
    });
  });

  function redirectToBooking(): void {
    const dateRange = startDate.toISOString() + "~" + endDate.toISOString();
    window.location.href = `/reserve?carId=${car.id}&dateRange=${dateRange}&branchId=${car.branchId}`;
  }
</script>

{#if $modalStore[0]}
  <div class="card flex flex-col justify-between p-4">
    <div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
      <div class="space-y-4 sm:w-96">
        <img
          alt="Car"
          src={car.photoUrl || "https://placehold.co/600x400"}
          class="mx-auto block w-full rounded sm:w-96" />
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
          <h3 class="h3 mx-auto block">Select a Date Range</h3>
        </div>
        <div class="space-y-4 sm:ml-7">
          <input class="input block sm:w-11/12" bind:this={ref} />
        </div>
        <button
          class="btn mx-auto mt-2 block rounded bg-primary-500 px-4 py-2"
          on:click={redirectToBooking}
          disabled={disabledBookButton}>Book Now</button>
      </div>
    </div>
  </div>
{/if}
