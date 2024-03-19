<script lang="ts" context="module">
  import type { PageData } from "./$types";

  export type PageDataReservation = PageData["reservation"];

  export type PageDataVehicleReservation = PageData["vehicleReservations"];
</script>

<script lang="ts">
  import EditReservationModal from "./EditReservationModal.svelte";
  import SeparatedText from "./SeparatedText.svelte";
  import EditIcon from "$lib/icons/EditIcon.svelte";
  import {
    getModalStore,
    type ModalComponent,
    type ModalSettings,
  } from "@skeletonlabs/skeleton";
  import flatpickr from "flatpickr";
  import { onMount } from "svelte";
  import {
    centsToDollars,
    getReservationDuration,
    setFlatpickrTheme,
  } from "$lib/util";

  export let data: PageData;

  const {
    vehicleReservations,
    reservation,
    reservation: {
      car,
      car: { branch },
    },
  } = data;

  const daysRented = getReservationDuration(
    reservation.plannedDepartureAt,
    reservation.plannedReturnAt,
  );

  let calendarRef: HTMLInputElement;

  onMount(async () => {
    // Determine calendar theme based on user preference. True = light mode, False = dark mode
    await setFlatpickrTheme();

    const calendar = flatpickr(calendarRef, {
      mode: "range",
      inline: true,
      defaultDate: [
        reservation.plannedDepartureAt,
        reservation.plannedReturnAt,
      ],
      onChange: () => {
        calendar.setDate([
          reservation.plannedDepartureAt,
          reservation.plannedReturnAt,
        ]);
      },
    });
  });

  const modalStore = getModalStore();

  const editReservationModalRef: ModalComponent = { ref: EditReservationModal };

  const editReservationModal: ModalSettings = {
    type: "component",
    component: editReservationModalRef,
  };

  function handleEditReservation(): void {
    const dataModal = {
      ...editReservationModal,
      meta: { reservation, vehicleReservations },
    };
    modalStore.trigger(dataModal);
  }
</script>

<div class="flex flex-col gap-2">
  <div class="card">
    <header class="card-header">
      <h2 class="text-lg font-bold">
        {`${car.make} ${car.model} ${car.year}`}
      </h2>
    </header>
    <section class="p-4">
      <div class="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-2">
        <div
          class="grid-item row-span-2 flex w-full items-center justify-center">
          <a class="card card-hover" href={`/browse-vehicles?carId=${car.id}`}>
            <img
              src={car.photoUrl}
              class="h-full w-full rounded-lg"
              alt={`${car.make} ${car.model} ${car.year}`} />
          </a>
        </div>
        <div class="grid-item">
          <div class="flex items-center justify-between">
            <h2 class=" h2 text-2xl font-bold">
              Reservation Details <span class="text-error-500"
                >{reservation.cancelled ? "(CANCELLED)" : ""}</span>
            </h2>
            <button
              class="variant-filled-primary btn w-fit self-end"
              on:click={handleEditReservation}
              ><EditIcon invertColor={true} constColor={true} /><span
                >Modify</span
              ></button>
          </div>
          <div
            class="mt-2 flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
            <div class="flex justify-center">
              <input disabled={true} hidden={true} bind:this={calendarRef} />
            </div>
            <div class=" flex flex-grow flex-col justify-center gap-1">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Planned Departure:</h2>
                <p class="">
                  {reservation.plannedDepartureAt.toLocaleString()}
                </p>
              </div>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Planned Return:</h2>
                <p class="">
                  {reservation.plannedReturnAt.toLocaleString()}
                </p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <h2 class="text-lg font-bold">Picked Up At:</h2>
                <p class="">
                  {reservation.pickedUpAt?.toLocaleString() ?? "Not Picked Up"}
                </p>
              </div>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Return At:</h2>
                <p class="">
                  {reservation.returnedAt?.toLocaleString() ?? "Not Returned"}
                </p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <h2 class="text-lg font-bold">Price Per Day:</h2>
                <p class="mt-0.5">
                  {`${centsToDollars(car.dailyPrice)}/day`}
                </p>
              </div>
              <div class=" flex items-stretch justify-between">
                <h2 class="text-lg font-bold">Days Rented:</h2>
                <p class="mt-0.5">
                  {`${daysRented} day${daysRented > 1 ? "s" : ""}`}
                </p>
              </div>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Quoted Price:</h2>
                <p class="mt-0.5">
                  {centsToDollars(reservation.quotedPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-item">
          <h2 class="h2 text-2xl font-bold">Branch Details</h2>
          <div class="mt-2 flex flex-col gap-1">
            <SeparatedText title="Name" content={branch.name} />
            <SeparatedText
              title="Street Address"
              content={branch.streetAddress} />
            <SeparatedText title="City" content={branch.city} />
            <SeparatedText title="Region" content={branch.region} />
            <SeparatedText title="Postal Code" content={branch.postalCode} />
          </div>
        </div>
      </div>
    </section>
    <!-- <footer class="card-footer">(footer)</footer> -->
  </div>
</div>
