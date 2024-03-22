<script lang="ts">
  import {
    getModalStore,
    getToastStore,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";
  import { fetchEntityById, createEntity, updateEntity } from "$lib/utils";
  import type { Car, Reservation, User } from "@prisma/client";

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  export let mode = "create";
  export let id = -1;

  let result: {
    entity?: User | Reservation | Car;
    message: string;
    background: string;
  };

  let reservationEntity: Reservation;
  let plannedDepartureAt: string | null;
  let plannedReturnAt: string | null;
  let pickedUpAt: string | null;
  let returnedAt: string | null;

  if (id !== -1) {
    fetchEntityById("Reservation", id).then((res) => {
      result = res;
      reservationEntity = result.entity as Reservation;
      plannedDepartureAt = parseDateTime(reservationEntity.plannedDepartureAt);
      plannedReturnAt = parseDateTime(reservationEntity.plannedReturnAt);
      pickedUpAt = parseDateTime(reservationEntity.pickedUpAt);
      returnedAt = parseDateTime(reservationEntity.returnedAt);
      const t: ToastSettings = {
        message: result.message,
        background: result.background,
      };
      toastStore.trigger(t);
    });
  }

  function parseDateTime(dateTime: string | number | Date | null) {
    let date;
    if (typeof dateTime === "string") {
      date = new Date(dateTime);
    } else if (dateTime instanceof Date) {
      date = dateTime;
    } else {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day}T${hour}:${minute}`;

    return formattedDateTime;
  }

  //@ts-expect-error to shut up the ts error
  async function handleEditSubmit(event) {
    event.preventDefault();

    const finalizedForm = new FormData();

    finalizedForm.append("reservationId", reservationEntity.id.toString());
    finalizedForm.append("carId", event.target.carId.value);
    finalizedForm.append("holderId", event.target.holderId.value);
    finalizedForm.append("quotedPrice", event.target.quotedPrice.value);
    finalizedForm.append("cancelled", event.target.cancelled.checked);
    finalizedForm.append(
      "plannedDepartureAt",
      new Date(event.target.plannedDepartureAt.value).toISOString(),
    );
    finalizedForm.append(
      "plannedReturnAt",
      new Date(event.target.plannedDepartureAt.value).toISOString(),
    );
    finalizedForm.append("createdAt", reservationEntity.createdAt.toString());
    finalizedForm.append("updatedAt", new Date().toISOString());
    finalizedForm.append("checkInNotes", event.target.quotedPrice.value);
    finalizedForm.append(
      "checkInLicenseNumber",
      event.target.checkInLicenseNumber.value,
    );
    finalizedForm.append(
      "checkInLicenseIssuingJurisdiction",
      event.target.checkInLicenseIssuingJurisdiction.value,
    );
    finalizedForm.append("pickedUpAt", event.target.pickedUpAt.value);
    finalizedForm.append("returnedAt", event.target.returnedAt.value);

    const result = await updateEntity("Reservation", finalizedForm);

    const t: ToastSettings = {
      message: result.message,
      background: result.background,
    };

    toastStore.trigger(t);

    if ($modalStore[0].response) $modalStore[0].response(result);

    modalStore.close();
  }

  // @ts-expect-error to shut up the ts error
  async function handleCreateSubmit(event) {
    event.preventDefault();

    const finalizedForm = new FormData();

    finalizedForm.append("carId", event.target.carId.value);
    finalizedForm.append("holderId", event.target.holderId.value);
    finalizedForm.append("quotedPrice", event.target.quotedPrice.value);
    finalizedForm.append("cancelled", event.target.quotedPrice.value);
    finalizedForm.append(
      "plannedDepartureAt",
      new Date(event.target.plannedDepartureAt.value).toISOString(),
    );
    finalizedForm.append(
      "plannedReturnAt",
      new Date(event.target.plannedDepartureAt.value).toISOString(),
    );
    finalizedForm.append("createdAt", new Date().toISOString());
    finalizedForm.append("updatedAt", new Date().toISOString());
    finalizedForm.append("checkInNotes", event.target.quotedPrice.value);
    finalizedForm.append(
      "checkInLicenseNumber",
      event.target.checkInLicenseNumber.value,
    );
    finalizedForm.append(
      "checkInLicenseIssuingJurisdiction",
      event.target.checkInLicenseIssuingJurisdiction.value,
    );
    finalizedForm.append("pickedUpAt", event.target.pickedUpAt.value);
    finalizedForm.append("returnedAt", event.target.returnedAt.value);

    const result = await createEntity("Reservation", finalizedForm);

    const t: ToastSettings = {
      message: result.message,
      background: result.background,
    };

    toastStore.trigger(t);

    if ($modalStore[0].response) $modalStore[0].response(result);

    modalStore.close();
  }
</script>

<div class="h-screen">
  <div class="card h-auto p-4">
    {#if $modalStore[0]}
      {#if mode === "edit"}
        {#if result && reservationEntity}
          <form on:submit={handleEditSubmit} class="space-y-2">
            <label class="label" for="carId">Car ID</label>
            <input
              class="input"
              type="number"
              name="carId"
              bind:value={reservationEntity.carId}
              placeholder="Car ID" />
            <label class="label" for="holderId">Holder ID</label>
            <input
              class="input"
              type="number"
              name="holderId"
              bind:value={reservationEntity.holderId}
              placeholder="Holder ID" />
            <label class="label" for="quotedPrice">Quoted Price (cents)</label>
            <input
              class="input"
              type="number"
              name="quotedPrice"
              bind:value={reservationEntity.quotedPrice}
              placeholder="Quoted Price" />

            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input
                  class="checkbox"
                  type="checkbox"
                  name="cancelled"
                  bind:checked={reservationEntity.cancelled} />
                <p>Cancelled</p>
              </label>
            </div>
            <label class="label" for="plannedDepartureAt"
              >Planned Departure</label>
            <input
              class="input"
              type="datetime-local"
              name="plannedDepartureAt"
              bind:value={plannedDepartureAt} />
            <label class="label" for="plannedReturnAt">Planned Return</label>
            <input
              class="input"
              type="datetime-local"
              name="plannedReturnAt"
              bind:value={plannedReturnAt} />
            <label class="label" for="checkInNotes">Check-in Notes</label>
            <input
              class="input"
              type="text"
              name="checkInNotes"
              bind:value={reservationEntity.checkInNotes}
              placeholder="Check-in Notes" />
            <label class="label" for="checkInLicenseNumber"
              >License Number</label>
            <input
              class="input"
              type="text"
              name="checkInLicenseNumber"
              bind:value={reservationEntity.checkInLicenseNumber}
              placeholder="License Number" />
            <label class="label" for="checkInLicenseIssuingJurisdiction"
              >Issuing Jurisdiction</label>
            <input
              class="input"
              type="text"
              name="checkInLicenseIssuingJurisdiction"
              bind:value={reservationEntity.checkInLicenseIssuingJurisdiction}
              placeholder="Issuing Jurisdiction" />
            <label class="label" for="pickedUpAt">Picked Up At</label>
            <input
              class="input"
              type="datetime-local"
              name="pickedUpAt"
              bind:value={pickedUpAt} />
            <label class="label" for="returnedAt">Returned At</label>
            <input
              class="input"
              type="datetime-local"
              name="returnedAt"
              bind:value={returnedAt} />

            <button class="variant-filled btn mx-auto block" type="submit"
              >Save Changes</button>
          </form>
        {/if}
      {:else}
        <form on:submit={handleCreateSubmit} class="space-y-2">
          <label class="label" for="carId">Car ID</label>
          <input
            class="input"
            type="number"
            name="carId"
            placeholder="Car ID" />
          <label class="label" for="holderId">Holder ID</label>
          <input
            class="input"
            type="number"
            name="holderId"
            placeholder="Holder ID" />
          <label class="label" for="quotedPrice">Quoted Price (cents)</label>
          <input
            class="input"
            type="number"
            name="quotedPrice"
            placeholder="Quoted Price" />

          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input class="checkbox" type="checkbox" name="cancelled" />
              <p>Cancelled</p>
            </label>
          </div>
          <label class="label" for="plannedDepartureAt"
            >Planned Departure</label>
          <input
            class="input"
            type="datetime-local"
            name="plannedDepartureAt" />
          <label class="label" for="plannedReturnAt">Planned Return</label>
          <input class="input" type="datetime-local" name="plannedReturnAt" />
          <label class="label" for="checkInNotes">Check-in Notes</label>
          <input
            class="input"
            type="text"
            name="checkInNotes"
            placeholder="Check-in Notes" />
          <label class="label" for="checkInLicenseNumber">License Number</label>
          <input
            class="input"
            type="text"
            name="checkInLicenseNumber"
            placeholder="License Number" />
          <label class="label" for="checkInLicenseIssuingJurisdiction"
            >Issuing Jurisdiction</label>
          <input
            class="input"
            type="text"
            name="checkInLicenseIssuingJurisdiction"
            placeholder="Issuing Jurisdiction" />
          <label class="label" for="pickedUpAt">Picked Up At</label>
          <input class="input" type="datetime-local" name="pickedUpAt" />
          <label class="label" for="returnedAt">Returned At</label>
          <input class="input" type="datetime-local" name="returnedAt" />

          <button class="variant-filled btn mx-auto block" type="submit"
            >Save Changes</button>
        </form>
      {/if}
    {/if}
  </div>
</div>
