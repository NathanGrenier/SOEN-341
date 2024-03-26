<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import {
    getModalStore,
    getToastStore,
    SlideToggle,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";
  import { createEntity, fetchEntityById } from "$lib/model/entityModal";
  import type { Car, Reservation, User } from "@prisma/client";
  import { CarColour as PrismaCarColor } from "@prisma/client";
  import EditIcon from "$lib/icons/EditIcon.svelte";
  import CirclePlus from "$lib/icons/CirclePlus.svelte";
  import DollarSign from "$lib/icons/DollarSign.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { newErrorToats, newSuccessToats } from "$lib/toast";
  import { enhance } from "$app/forms";

  // BUG: Might break when deployed to vercel
  const CarColour = { ...PrismaCarColor };

  export let parent: SvelteComponent;
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
      // Convert cents to dollars
      carEntity.dailyPrice = carEntity.dailyPrice / 100;
      const t: ToastSettings = {
        message: result.message,
        background: result.background,
      };
      toastStore.trigger(t);
    });
  }

  let submitting = false;

  const submitUpdateCar: SubmitFunction = ({ formData }) => {
    submitting = true;
    formData.append("carId", `${carEntity.id}`);
    formData.append("bookingDisabled", `${carEntity.bookingDisabled}`); // Slider isn't a form input element, have to add it manually
    formData.append("dailyPrice", `${carEntity.dailyPrice * 100}`); // Convert dollars to cents
    formData.append("photoUrl", `${carEntity.photoUrl}`);

    return async ({ result, update }) => {
      switch (result.type) {
        case "success":
          modalStore.close();
          toastStore.clear();
          toastStore.trigger(newSuccessToats("Car updated"));
          break;
        case "error":
          toastStore.trigger(
            newErrorToats(`Failed to update car: ${result.error?.message}`),
          );
          break;
      }
      await update({ reset: result.type === "success" });
      submitting = false;
    };
  };

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

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        carEntity.photoUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
</script>

{#if $modalStore[0]}
  <div class="card w-modal space-y-4 p-4 shadow-xl">
    {#if mode === "edit"}
      {#if result && carEntity}
        <article>
          <header
            class="flex items-center justify-start gap-2 text-2xl font-bold">
            <EditIcon /><span>Modify Car</span>
          </header>
          <form
            class="mt-2 flex flex-col gap-2 border border-surface-500 p-4 rounded-container-token"
            method="POST"
            action="?/updateCar"
            id="updateCar"
            enctype="multipart/form-data"
            use:enhance={submitUpdateCar}>
            <div class="grid grid-cols-2 grid-rows-2 gap-4">
              <div class="col-span-1 row-span-2">
                <div class="flex flex-col gap-2">
                  <label class="label">
                    <span>Make</span>
                    <input
                      class="input"
                      type="text"
                      name="make"
                      bind:value={carEntity.make} />
                  </label>
                  <label class="label">
                    <span>Model</span>
                    <input
                      class="input"
                      type="text"
                      name="model"
                      bind:value={carEntity.model} />
                  </label>
                  <label class="label">
                    <span>Year</span>
                    <input
                      class="input"
                      type="number"
                      name="year"
                      bind:value={carEntity.year} />
                  </label>
                  <label class="label">
                    <span>Colour</span>
                    <select class="select" name="colour">
                      {#each Object.keys(CarColour) as color}
                        <option
                          value={color}
                          selected={color === carEntity.colour}>{color}</option>
                      {/each}
                    </select>
                  </label>
                  <label class="label">
                    <span>Seats</span>
                    <input
                      class="input"
                      type="number"
                      name="seats"
                      bind:value={carEntity.seats} />
                  </label>
                </div>
              </div>
              <div class="col-span-1 row-span-1">
                <div class="flex justify-center">
                  {#if carEntity.photoUrl}
                    <img
                      class="max-h-56 max-w-56 rounded-md object-cover"
                      src={carEntity.photoUrl}
                      alt={`${carEntity.make} ${carEntity.model} ${carEntity.year} `} />
                  {:else}
                    <span>No Image Yet</span>
                  {/if}
                </div>
                <label class="label">
                  <span>New Photo</span>
                  <input
                    class="input"
                    type="file"
                    name="photo"
                    bind:value={carEntity.photoUrl}
                    on:change={handleFileChange} />
                </label>
              </div>
              <div class="col-span-1 row-span-1">
                <div class="flex flex-col gap-2">
                  <label class="label">
                    <span>Daily Price</span>
                    <div
                      class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
                      <div class="input-group-shim"><DollarSign /></div>
                      <input
                        type="number"
                        name="dailyPrice"
                        bind:value={carEntity.dailyPrice} />
                    </div>
                  </label>
                  <label class="label">
                    <span>Branch ID</span>
                    <input
                      class="input"
                      type="number"
                      name="branchId"
                      bind:value={carEntity.branchId} />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label class="label">
                <span>Description</span>
                <textarea
                  class="textarea"
                  name="description"
                  bind:value={carEntity.description}></textarea>
              </label>
            </div>
            <div class="flex justify-center">
              <SlideToggle
                name="bookingDisabled"
                bind:checked={carEntity.bookingDisabled}
                active="bg-error-500">Disable Booking</SlideToggle>
            </div>
          </form>
        </article>
        <footer class="modal-footer {parent.regionFooter}">
          <button
            class="variant-outline-error btn {parent.buttonNeutral}"
            on:click={parent.onClose}>{parent.buttonTextCancel}</button>
          <button
            class="variant-filled-primary btn {parent.buttonPositive}"
            type="submit"
            disabled={submitting}
            form="updateCar">Save Changes</button>
        </footer>
      {/if}
    {:else}
      <header class="flex items-center justify-start gap-2 text-2xl font-bold">
        <CirclePlus invertColor={true} constColor={true} /><span
          >Create Car</span>
      </header>
      <article>
        <form
          on:submit={handleCreateSubmit}
          class="mt-2 items-baseline justify-around border border-surface-500 p-4 rounded-container-token"
          method="POST"
          action="?/createCar"
          id="createCar">
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
          <!--<ImageBlob bind:imageBlobUrl={newCarPhotoURL} />-->
          <label class="label" for="photoUrl">Photo URL</label>
          <input
            class="input"
            type="url"
            id="photoUrl"
            name="photoUrl"
            bind:value={newCarPhotoURL} />

          <label class="label" for="dailyPrice">Daily Price (in cents)</label>
          <input
            class="input"
            type="number"
            id="dailyPrice"
            name="dailyPrice" />

          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input class="checkbox" type="checkbox" name="bookingDisabled" />
              <p>Disable Booking</p>
            </label>
          </div>

          <label class="label" for="branchId">Branch ID</label>
          <input class="input" type="number" name="branchId" />
        </form>
      </article>
      <footer class="modal-footer {parent.regionFooter}">
        <button
          class="variant-outline-error btn {parent.buttonNeutral}"
          on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button
          class="variant-filled-primary btn {parent.buttonPositive}"
          type="submit"
          form="createCar">Create Car</button>
      </footer>
    {/if}
  </div>
{/if}
