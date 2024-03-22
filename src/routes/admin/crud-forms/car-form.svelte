<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import {
    getModalStore,
    getToastStore,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";
  import ImageBlob from "../blob/blobCrud.svelte";
  import { createEntity, fetchEntityById, updateEntity } from "$lib/utils";
  import type { Car, Reservation, User } from "@prisma/client";

  const CarColour = {
    BLACK: "BLACK",
    WHITE: "WHITE",
    GREY: "GREY",
    SILVER: "SILVER",
    GOLD: "GOLD",
    RED: "RED",
    ORANGE: "ORANGE",
    YELLOW: "YELLOW",
    GREEN: "GREEN",
    BLUE: "BLUE",
    PURPLE: "PURPLE",
    PINK: "PINK",
    MULTI: "MULTI",
  };

  export const parent: SvelteComponent | null = null;
  export let mode = "create";
  export let id = -1;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let result: {
    entity?: User | Reservation | Car;
    message: string;
    background: string;
  };

  let carEntity: Car;

  let newCarPhotoURL: string;

  if (id !== -1) {
    fetchEntityById("Car", id).then((res) => {
      result = res;
      carEntity = result.entity as Car;
      const t: ToastSettings = {
        message: result.message,
        background: result.background,
      };
      console.log(carEntity);
      toastStore.trigger(t);
    });
  }

  //@ts-expect-error to shut up the ts error
  async function handleEditSubmit(event) {
    event.preventDefault();

    const finalizedForm = new FormData();

    finalizedForm.append("carId", carEntity.id.toString());
    finalizedForm.append("branchId", event.target.branchId.value);
    finalizedForm.append("make", event.target.make.value);
    finalizedForm.append("model", event.target.model.value);
    finalizedForm.append("year", event.target.year.value);
    finalizedForm.append("colour", event.target.colour.value);
    finalizedForm.append("seats", event.target.seats.value);
    finalizedForm.append("description", event.target.description.value);
    finalizedForm.append("photoUrl", event.target.photoUrl.value);
    finalizedForm.append("dailyPrice", event.target.dailyPrice.value);
    finalizedForm.append(
      "bookingDisabled",
      event.target.bookingDisabled.checked,
    );
    finalizedForm.append("createdAt", carEntity.createdAt.toString());
    finalizedForm.append("updatedAt", new Date().toISOString());

    const result = await updateEntity("Car", finalizedForm);

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

    finalizedForm.append("branchId", event.target.branchId.value);
    finalizedForm.append("make", event.target.make.value);
    finalizedForm.append("model", event.target.model.value);
    finalizedForm.append("year", event.target.year.value);
    finalizedForm.append("colour", event.target.colour.value);
    finalizedForm.append("seats", event.target.seats.value);
    finalizedForm.append("description", event.target.description.value);
    finalizedForm.append("photoUrl", event.target.photoUrl.value);
    finalizedForm.append("dailyPrice", event.target.dailyPrice.value);
    finalizedForm.append(
      "bookingDisabled",
      event.target.bookingDisabled.checked,
    );
    finalizedForm.append("createdAt", new Date().toISOString());
    finalizedForm.append("updatedAt", new Date().toISOString());

    const result = await createEntity("Car", finalizedForm);

    const t: ToastSettings = {
      message: result.message,
      background: result.background,
    };

    toastStore.trigger(t);

    if ($modalStore[0].response) $modalStore[0].response(result);

    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <p class="card h-screen overflow-y-scroll p-4">
    {#if mode === "edit"}
      {#if result && carEntity}
        <form on:submit={handleEditSubmit} class="space-y-1">
          <label class="label" for="make">Make</label>
          <input
            class="input"
            type="text"
            id="make"
            name="make"
            bind:value={carEntity.make} />

          <label class="label" for="model">Model</label>
          <input
            class="input"
            type="text"
            id="model"
            name="model"
            bind:value={carEntity.model} />

          <label class="label" for="year">Year</label>
          <input
            class="input"
            type="number"
            id="year"
            name="year"
            bind:value={carEntity.year} />

          <label class="label" for="colour">Colour</label>
          <select class="select" name="colour">
            {#each Object.keys(CarColour) as color}
              <option value={color} selected={color === carEntity.colour}
                >{color}</option>
            {/each}
          </select>

          <label class="label" for="seats">Seats</label>
          <input
            class="input"
            type="number"
            id="seats"
            name="seats"
            bind:value={carEntity.seats} />

          <label class="label" for="description">Description</label>
          <textarea
            class="textarea"
            id="description"
            name="description"
            bind:value={carEntity.description}></textarea>
          <ImageBlob bind:imageBlobUrl={carEntity.photoUrl} />
          <label class="label" for="photoUrl">Photo URL</label>
          <input
            class="input"
            type="url"
            id="photoUrl"
            name="photoUrl"
            bind:value={carEntity.photoUrl} />

          <label class="label" for="dailyPrice">Daily Price (in cents)</label>
          <input
            class="input"
            type="number"
            id="dailyPrice"
            name="dailyPrice"
            bind:value={carEntity.dailyPrice} />

          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                class="checkbox"
                type="checkbox"
                name="bookingDisabled"
                bind:checked={carEntity.bookingDisabled} />
              <p>Check to Disable Booking</p>
            </label>
          </div>

          <label class="label" for="branchId">Branch ID</label>
          <input
            class="input"
            type="number"
            name="branchId"
            bind:value={carEntity.branchId} />
          <button class="variant-filled btn mx-auto block" type="submit"
            >Save Changes</button>
        </form>
      {/if}
    {:else}
      <form on:submit={handleCreateSubmit} class="space-y-1">
        <label class="label" for="make">Make</label>
        <input class="input" type="text" id="make" name="make" />

        <label class="label" for="model">Model</label>
        <input class="input" type="text" id="model" name="model" />

        <label class="label" for="year">Year</label>
        <input class="input" type="number" id="year" name="year" />

        <label class="label" for="colour">Colour</label>
        <select class="select" name="colour">
          {#each Object.keys(CarColour) as color}
            <option value={color}>{color}</option>
          {/each}
        </select>

        <label class="label" for="seats">Seats</label>
        <input class="input" type="number" id="seats" name="seats" />

        <label class="label" for="description">Description</label>
        <textarea class="textarea" id="description" name="description"
        ></textarea>
        <ImageBlob bind:imageBlobUrl={newCarPhotoURL} />
        <label class="label" for="photoUrl">Photo URL</label>
        <input
          class="input"
          type="url"
          id="photoUrl"
          name="photoUrl"
          bind:value={newCarPhotoURL} />

        <label class="label" for="dailyPrice">Daily Price (in cents)</label>
        <input class="input" type="number" id="dailyPrice" name="dailyPrice" />

        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input class="checkbox" type="checkbox" name="bookingDisabled" />
            <p>Disable Booking</p>
          </label>
        </div>

        <label class="label" for="branchId">Branch ID</label>
        <input class="input" type="number" name="branchId" />
        <button class="variant-filled btn mx-auto block" type="submit"
          >Create Car</button>
      </form>
    {/if}
  </p>
{/if}
