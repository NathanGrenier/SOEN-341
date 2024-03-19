<script lang="ts">
  import { onMount, type SvelteComponent } from "svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import EditIcon from "$lib/icons/EditIcon.svelte";
  import type {
    PageDataReservation,
    PageDataVehicleReservation,
  } from "./+page.svelte";
  import {
    centsToDollars,
    getReservationDuration,
    setFlatpickrTheme,
  } from "$lib/util";

  import flatpickr from "flatpickr";

  const modalStore = getModalStore();

  export let parent: SvelteComponent;

  const currentReservation: PageDataReservation =
    $modalStore[0].meta.reservation;
  const vehicleReservations: PageDataVehicleReservation =
    $modalStore[0].meta.vehicleReservations;

  const formData = {
    plannedDeparture: currentReservation.plannedDepartureAt,
    plannedReturn: currentReservation.plannedReturnAt,
  };

  let form: HTMLFormElement;

  let calendarRef: HTMLInputElement;

  const disabled = vehicleReservations
    .filter((res) => res.id !== currentReservation.id) // Filter out the current reservation times
    .map((res) => {
      return {
        from: res.plannedDepartureAt,
        to: res.plannedReturnAt,
      };
    });

  onMount(async () => {
    // Determine calendar theme based on user preference. True = light mode, False = dark mode
    await setFlatpickrTheme();

    flatpickr(calendarRef, {
      allowInput: true,
      clickOpens: true,
      enableTime: true,
      mode: "range",
      inline: true,
      minDate: new Date(),
      disable: disabled,
      defaultDate: [formData.plannedDeparture, formData.plannedReturn],
      onChange: (selectedDates) => {
        if (selectedDates.length !== 2) return;
        formData.plannedDeparture = selectedDates[0];
        formData.plannedReturn = selectedDates[1];
      },
    });
  });

  $: daysRented = getReservationDuration(
    formData.plannedDeparture,
    formData.plannedReturn,
  );

  function onFormSubmit(): void {
    form.submit();
    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <div class="card w-modal space-y-4 p-4 shadow-xl">
    <header class="flex items-center justify-start gap-2 text-2xl font-bold">
      <EditIcon /> <span>Modify Reservation Details</span>
    </header>
    <article>
      <form
        class="space-y-4 border border-surface-500 p-4 rounded-container-token"
        action="?/modifyReservation"
        bind:this={form}>
        <label class="label">
          <span>New Reservation Dates</span>
          <div class="flex flex-col items-center gap-2">
            <input class="input" bind:this={calendarRef} />
          </div>
        </label>
        <div class="flex items-baseline justify-between gap-2">
          <h2 class="text-lg font-bold">Price Per Day:</h2>
          <div
            class="flex-grow border-b-4 border-dotted border-black dark:border-white">
          </div>
          <p class="mt-0.5">
            {`${centsToDollars(currentReservation.car.dailyPrice)}/day`}
          </p>
        </div>
        <div
          style="margin-top: 0px;"
          class="flex items-baseline justify-between gap-2">
          <h2 class="text-lg font-bold">Days Rented:</h2>
          <div
            class="flex-grow border-b-4 border-dotted border-black dark:border-white">
          </div>
          <p class="mt-0.5">
            {`${daysRented} day${daysRented > 1 ? "s" : ""}`}
          </p>
        </div>
        <div
          style="margin-top: 0px;"
          class=" flex items-baseline justify-between gap-2">
          <h2 class="text-lg font-bold">Updated Price:</h2>
          <div
            class="flex-grow border-b-4 border-dotted border-black dark:border-white">
          </div>
          <p class="mt-0.5">
            {centsToDollars(
              getReservationDuration(
                formData.plannedDeparture,
                formData.plannedReturn,
              ) * currentReservation.car.dailyPrice,
            )}
          </p>
        </div>
      </form>
    </article>
    <footer class="modal-footer {parent.regionFooter}">
      <button
        class="variant-outline-error btn {parent.buttonNeutral}"
        on:click={parent.onClose}>{parent.buttonTextCancel}</button>
      <button
        class="variant-filled-primary btn {parent.buttonPositive}"
        on:click={onFormSubmit}>Submit</button>
    </footer>
  </div>
{/if}
