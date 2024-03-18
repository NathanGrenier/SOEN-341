<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import {
    createReservation,
    updateReservation,
    getReservationById,
  } from "$lib/controllers/reservationController";

  export const parent: SvelteComponent | null = null;
  const modalStore = getModalStore();

  export let mode = "create";
  export let id = -1;

  //generic data
  export let data = {
    carId: 0,
    holderId: 0,
    replacesId: 0,
    quotedPrice: 0,
    cancelled: false,
    plannedDepartureAt: new Date().toISOString().slice(0, 16),
    plannedReturnAt: new Date().toISOString().slice(0, 16),
    createdAt: new Date().toISOString().slice(0, 16),
    updatedAt: new Date().toISOString().slice(0, 16),
    checkInNotes: "",
    checkInLicenseNumber: "",
    checkInLicenseIssuingJurisdiction: "",
    pickedUpAt: new Date().toISOString().slice(0, 16),
    returnedAt: new Date().toISOString().slice(0, 16),
  };

  onMount(async () => {
    if (mode === "edit" && id != -1) {
      try {
        const reservationInfoById = await getReservationById(id);
        //fetched data
        data = {
          carId: reservationInfoById ? reservationInfoById.carId : 0,
          holderId: reservationInfoById ? reservationInfoById.holderId : 0,
          replacesId: reservationInfoById
            ? reservationInfoById.replacesId ?? 0
            : 0,
          quotedPrice: reservationInfoById
            ? reservationInfoById.quotedPrice
            : 0,
          cancelled: reservationInfoById
            ? reservationInfoById.cancelled
            : false,
          plannedDepartureAt: reservationInfoById
            ? new Date(reservationInfoById.plannedDepartureAt)
                .toISOString()
                .slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          plannedReturnAt: reservationInfoById
            ? new Date(reservationInfoById.plannedReturnAt)
                .toISOString()
                .slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          createdAt: reservationInfoById
            ? new Date(reservationInfoById.createdAt).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          updatedAt: reservationInfoById
            ? new Date(reservationInfoById.updatedAt).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),

          checkInNotes: reservationInfoById
            ? reservationInfoById.checkInNotes
            : "",
          checkInLicenseNumber: reservationInfoById
            ? reservationInfoById.checkInLicenseNumber
            : "",
          checkInLicenseIssuingJurisdiction: reservationInfoById
            ? reservationInfoById.checkInLicenseIssuingJurisdiction
            : "",
          pickedUpAt:
            reservationInfoById && reservationInfoById.pickedUpAt
              ? new Date(reservationInfoById.pickedUpAt)
                  .toISOString()
                  .slice(0, 16)
              : null,
          returnedAt:
            reservationInfoById && reservationInfoById.returnedAt
              ? new Date(reservationInfoById.returnedAt)
                  .toISOString()
                  .slice(0, 16)
              : null,
        };
      } catch (error) {
        console.error("Error loading reservation data:", error);
      }
    }
  });

  //@ts-expect-error to make ts happy
  function handleEditSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    let result = updateReservation(id, {
      carId: parseInt(event.target.carId.value),
      holderId: parseInt(event.target.holderId.value),
      replacesId: data.replacesId ? parseInt(data.replacesId) : null,
      quotedPrice: parseInt(event.target.quotedPrice.value),
      cancelled: event.target.cancelled.checked,
      plannedDepartureAt: new Date(event.target.plannedDepartureAt.value),
      plannedReturnAt: new Date(event.target.plannedReturnAt.value),
      createdAt: event.target.createdAt,
      updatedAt: event.target.createdAt,
      checkInNotes: event.target.checkInNotes.value,
      checkInLicenseNumber: event.target.checkInLicenseNumber.value,
      checkInLicenseIssuingJurisdiction:
        event.target.checkInLicenseIssuingJurisdiction.value,
      pickedUpAt: event.target.pickedUpAt.value
        ? new Date(event.target.pickedUpAt.value)
        : null,
      returnedAt: event.target.returnedAt.value
        ? new Date(event.target.returnedAt.value)
        : null,
    });

    if ($modalStore[0].response) $modalStore[0].response(result);
    modalStore.close();
  }

  //@ts-expect-error to make ts happy
  function handleCreateSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    let result = createReservation({
      carId: parseInt(event.target.carId.value),
      holderId: parseInt(event.target.holderId.value),
      quotedPrice: parseInt(event.target.quotedPrice.value),
      cancelled: event.target.cancelled.checked,
      plannedDepartureAt: new Date(event.target.plannedDepartureAt.value),
      plannedReturnAt: new Date(event.target.plannedReturnAt.value),
      createdAt: new Date(),
      updatedAt: new Date(),
      checkInNotes: event.target.checkInNotes.value,
      checkInLicenseNumber: event.target.checkInLicenseNumber.value,
      checkInLicenseIssuingJurisdiction:
        event.target.checkInLicenseIssuingJurisdiction.value,
    });

    if ($modalStore[0].response) $modalStore[0].response(result);
    modalStore.close();
  }

  function validateForm() {
    if (!data.carId || !data.holderId || !data.quotedPrice) {
      alert("Please ensure all required fields are filled out correctly.");
      return false;
    }
    return true;
  }
</script>

{#if $modalStore[0]}
  {#if mode === "edit"}
    <form on:submit={handleEditSubmit}>
      <label class="label" for="carId">Car ID:</label>
      <input
        class="input"
        type="number"
        name="carId"
        bind:value={data.carId}
        placeholder="Car ID" />
      <label class="label" for="holderId">Holder ID:</label>
      <input
        class="input"
        type="number"
        name="holderId"
        bind:value={data.holderId}
        placeholder="Holder ID" />
      <label class="label" for="quotedPrice">Quoted Price (Cents):</label>
      <input
        class="input"
        type="number"
        name="quotedPrice"
        bind:value={data.quotedPrice}
        placeholder="Quoted Price" />

      <div class="space-y-2">
        <label class="flex items-center space-x-2">
          <input
            class="checkbox"
            type="checkbox"
            name="cancelled"
            bind:checked={data.cancelled} />
          <p>Cancelled</p>
        </label>
      </div>
      <label class="label" for="plannedDepartureAt">Planned Departure:</label>
      <input
        class="input"
        type="datetime-local"
        name="plannedDepartureAt"
        bind:value={data.plannedDepartureAt} />
      <label class="label" for="plannedReturnAt">Planned Return:</label>
      <input
        class="input"
        type="datetime-local"
        name="plannedReturnAt"
        bind:value={data.plannedReturnAt} />
      <label class="label" for="checkInNotes">Check-in Notes:</label>
      <input
        class="input"
        type="text"
        name="checkInNotes"
        bind:value={data.checkInNotes}
        placeholder="Check-in Notes" />
      <label class="label" for="checkInLicenseNumber">License Number:</label>
      <input
        class="input"
        type="text"
        name="checkInLicenseNumber"
        bind:value={data.checkInLicenseNumber}
        placeholder="License Number" />
      <label class="label" for="checkInLicenseIssuingJurisdiction"
        >Issuing Jurisdiction:</label>
      <input
        class="input"
        type="text"
        name="checkInLicenseIssuingJurisdiction"
        bind:value={data.checkInLicenseIssuingJurisdiction}
        placeholder="Issuing Jurisdiction" />
      <label class="label" for="pickedUpAt">Picked Up At:</label>
      <input
        class="input"
        type="datetime-local"
        name="pickedUpAt"
        bind:value={data.pickedUpAt} />
      <label class="label" for="returnedAt">Returned At:</label>
      <input
        class="input"
        type="datetime-local"
        name="returnedAt"
        bind:value={data.returnedAt} />

      <button class="variant-filled btn" type="submit">Save Changes</button>
    </form>
  {:else}
    <form on:submit={handleCreateSubmit}></form>
  {/if}
{/if}
