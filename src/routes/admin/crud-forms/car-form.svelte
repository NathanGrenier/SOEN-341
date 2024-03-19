<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import ImageBlob from "../blob/blobCrud.svelte";

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

  export let data = {
    make: "",
    model: "",
    year: new Date().getFullYear(),
    colour: "BLACK",
    seats: 4,
    description: "",
    photoUrl: "",
    dailyPrice: 5000,
    bookingDisabled: false,
    branchId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  import {
    createCar,
    updateCar,
    getCarById,
  } from "$lib/controllers/carController"; // Adjust the path if needed

  // Array to hold your branch data
  //let branches = [1, 2, 3];

  onMount(async () => {
    // Fetch branch data (if needed)
    // branches = await fetchBranches();

    if (mode === "edit" && id !== -1) {
      try {
        const carInfoById = await getCarById(id);
        data = {
          make: carInfoById ? carInfoById.make : "",
          model: carInfoById ? carInfoById.model : "",
          year: carInfoById ? carInfoById.year : new Date().getFullYear(),
          colour: carInfoById ? carInfoById.colour : "BLACK",
          seats: carInfoById ? carInfoById.seats : 4,
          description: carInfoById ? carInfoById.description : "",
          photoUrl: carInfoById ? carInfoById.photoUrl ?? "" : "",
          dailyPrice: carInfoById ? carInfoById.dailyPrice : 5000,
          bookingDisabled: carInfoById ? carInfoById.bookingDisabled : false,
          branchId: carInfoById ? carInfoById.branchId : 1,
          createdAt: carInfoById ? carInfoById.createdAt : new Date(),
          updatedAt: carInfoById ? carInfoById.updatedAt : new Date(),
        };
      } catch (error) {
        console.error("Error loading car data:", error);
      }
    }
  });

  // @ts-expect-error to shut up the ts error
  function handleEditSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    let result = updateCar(id, {
      make: event.target.make.value,
      model: event.target.model.value,
      year: event.target.year.value.parseFloat,
      colour: event.target.colour.value,
      seats: event.target.seats.value.parseFloat,
      description: event.target.description.value,
      photoUrl: event.target.photoUrl.value,
      dailyPrice: event.target.dailyPrice.value.parseFloat,
      bookingDisabled: event.target.bookingDisabled.checked,
      branchId: event.target.branchId.value.parseFloat,
      updatedAt: new Date(),
    });

    if ($modalStore[0].response) $modalStore[0].response(result);
    modalStore.close();
  }
  // @ts-expect-error to shut up the ts error
  function handleCreateSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    let result = createCar({
      make: event.target.make.value,
      model: event.target.model.value,
      year: event.target.year.value.parseFloat,
      colour: event.target.colour.value,
      seats: event.target.seats.value.parseFloat,
      description: event.target.description.value,
      photoUrl: event.target.photoUrl.value,
      dailyPrice: event.target.dailyPrice.value.parseFloat,
      bookingDisabled: event.target.bookingDisabled.checked,
      branchId: event.target.branchId.value.parseFloat,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if ($modalStore[0].response) $modalStore[0].response(result);
    modalStore.close();
  }

  function validateForm() {
    // Implement your validation logic here.
    return true;
  }
</script>

{#if $modalStore[0]}
  {#if (mode = "edit")}
    <form on:submit={handleEditSubmit}>
      <label class="label" for="make">Make:</label>
      <input
        class="input"
        type="text"
        id="make"
        name="make"
        bind:value={data.make} />

      <label class="label" for="model">Model:</label>
      <input
        class="input"
        type="text"
        id="model"
        name="model"
        bind:value={data.model} />

      <label class="label" for="year">Year:</label>
      <input
        class="input"
        type="number"
        id="year"
        name="year"
        bind:value={data.year} />

      <label class="label" for="colour">Colour:</label>
      <select class="select" name="colour">
        {#each Object.keys(CarColour) as color}
          <option value={color} selected={color === data.colour}
            >{color}</option>
        {/each}
      </select>

      <label class="label" for="seats">Seats:</label>
      <input
        class="input"
        type="number"
        id="seats"
        name="seats"
        bind:value={data.seats} />

      <label class="label" for="description">Description:</label>
      <textarea
        class="textarea"
        id="description"
        name="description"
        bind:value={data.description}></textarea>
      <ImageBlob imageBlobUrl={data.photoUrl} bind:data={data.photoUrl} />
      <label class="label" for="photoUrl">Photo URL:</label>
      <input
        class="input"
        type="url"
        id="photoUrl"
        name="photoUrl"
        bind:value={data.photoUrl} />

      <label class="label" for="dailyPrice">Daily Price (in cents):</label>
      <input
        class="input"
        type="number"
        id="dailyPrice"
        name="dailyPrice"
        bind:value={data.dailyPrice} />

      <div class="space-y-2">
        <label class="flex items-center space-x-2">
          <input
            class="checkbox"
            type="checkbox"
            name="bookingDisabled"
            bind:checked={data.bookingDisabled} />
          <p>Check to Disable Booking</p>
        </label>
      </div>

      <label class="label" for="branchId">Branch Id:</label>
      <input
        class="input"
        type="number"
        name="branchId"
        bind:value={data.branchId} />
      <button class="variant-filled btn" type="submit">Save Changes</button>
    </form>
  {:else}
    <form on:submit={handleCreateSubmit}>
      <button class="button" type="submit">Create Car</button>
    </form>
  {/if}
{/if}
