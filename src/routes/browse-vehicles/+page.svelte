<script lang="ts">
  import {
    RangeSlider,
    type PaginationSettings,
    type ModalComponent,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";
  import {
    getModalStore,
    type ModalSettings,
    Paginator,
  } from "@skeletonlabs/skeleton";
  import {} from "@skeletonlabs/skeleton";
  import { TreeView, TreeViewItem } from "@skeletonlabs/skeleton";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import { CarColour, type Car } from "@prisma/client";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import ViewCarModal from "$lib/components/modals/ViewCarModal.svelte";

  export let data;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let minimumPrice = 0;
  let maximumPrice = 2000;
  let { cars } = data;
  let { branches } = data;
  let selectedCarColour = "No Specific Color";
  let selectedBranch = -1;

  $: paginatedCars = cars.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit +
      paginationSettings.limit,
  );

  let isLoading = false;

  const UTCtoday = new Date();

  const today = UTCtoday.toISOString().split("T")[0];

  let startDate = today;
  let endDate = today;

  const handleStartDateChange = (event: Event) => {
    const eventTarget = event.target as HTMLTextAreaElement;
    startDate = eventTarget.value;
    if (startDate > endDate) {
      endDate = startDate;
    }
  };

  const handleEndDateChange = (event: Event) => {
    const eventTarget = event.target as HTMLTextAreaElement;
    endDate = eventTarget.value;
    if (endDate < startDate) {
      startDate = endDate;
    }
  };

  let paginationSettings = {
    page: 0,
    limit: 10,
    size: cars.length,
    amounts: [1, 2, 5, 10],
  } satisfies PaginationSettings;

  function toTitleCase(str: string) {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  }

  function showPopup(car: Car) {
    const modalComponent: ModalComponent = {
      ref: ViewCarModal,
      props: {
        car: car,
      },
    };

    const modal: ModalSettings = {
      type: "component",
      component: modalComponent,
    };

    modalStore.trigger(modal);

    return null;
  }

  function handleFilter(): void {
    cars = [];
    isLoading = true;
    const formData = new FormData();
    formData.append("colour", selectedCarColour);
    formData.append("minPrice", minimumPrice.toString());
    formData.append("maxPrice", maximumPrice.toString());
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    fetch("", {
      method: "POST",
      body: formData,
    })
      .then((res: Response) => {
        if (res.ok) {
          return res.json();
        } else {
          const cancelErrorToast: ToastSettings = {
            message: "There was an error filtering cars.",
            background: "variant-filled-error",
            autohide: false,
          };

          toastStore.trigger(cancelErrorToast);
        }
      })
      .then((data) => {
        const jsonData = JSON.parse(data.data);

        const cars = [];

        for (const item of jsonData) {
          const parsedItem = JSON.parse(item);
          cars.push(parsedItem);
        }

        return cars;
      })
      .then((formattedCars) => {
        const flattenedCars = formattedCars.reduce((acc, current) => {
          return acc.concat(current);
        }, []);

        isLoading = false;
        cars = flattenedCars;
        paginationSettings.size = cars.length;
        paginationSettings.page = 0;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
</script>

<div class="card my-2 space-y-2 p-4">
  <TreeView>
    <TreeViewItem>
      <h6 class="h6 font-bold">Search Filters</h6>
      <svelte:fragment slot="children">
        <div class="space-y-4">
          <label class="label mt-2">
            <span>Car Color</span>
            <select class="select" bind:value={selectedCarColour}>
              <option value={"No Specific Color"}>No Specific Color</option>
              {#each Object.values(CarColour) as colour}
                <option value={colour}>{toTitleCase(colour)}</option>
              {/each}
            </select>
          </label>
          <label class="label">
            <span>Branch Location</span>
            <select class="select" bind:value={selectedBranch}>
              <option value={-1}>No Specific Branch</option>
              {#each branches as branch}
                <option value={branch.id}>{branch.name}</option>
              {/each}
            </select>
          </label>
          <div class="grid grid-cols-2 gap-6">
            <div class="col">
              <RangeSlider
                name="range-slider"
                bind:value={minimumPrice}
                min={0}
                max={750}
                step={5}
                ticked>Minimum Price</RangeSlider>
              <span class="price-display">${minimumPrice}</span>
            </div>
            <div class="col">
              <RangeSlider
                name="range-slider"
                bind:value={maximumPrice}
                min={minimumPrice}
                max={1000}
                step={10}
                ticked>Maximum Price</RangeSlider>
              <span class="price-display">${maximumPrice}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="col">
              <label class="label">
                <span>Start Date</span>
                <input
                  type="date"
                  class="input"
                  bind:value={startDate}
                  min={today}
                  on:input={handleStartDateChange} />
              </label>
            </div>
            <div class="col">
              <label class="label">
                <span>End Date</span>
                <input
                  type="date"
                  class="input"
                  bind:value={endDate}
                  min={startDate}
                  on:input={handleEndDateChange} />
              </label>
            </div>
          </div>
          <button
            class="btn mx-auto block w-20 bg-tertiary-500"
            on:click={handleFilter}>Filter</button>
        </div>
      </svelte:fragment>
    </TreeViewItem>
  </TreeView>
</div>

{#if isLoading}
  <div class="mt-4 flex flex-col items-center justify-center space-y-4">
    <div class="flex items-center justify-center">
      <ProgressRadial value={undefined} class="w-9" />
    </div>
    <p>Searching for Cars</p>
  </div>
{:else if cars.length === 0}
  <div class="mt-2 flex flex-col items-center justify-center">
    <p class="card p-4">No cars found</p>
  </div>
{/if}

<div class="my-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {#each paginatedCars as car}
    <div class="card bg-secondary-500">
      <div class="p-4">
        <img
          src={car.photoUrl || "https://placehold.co/600x400"}
          alt="Car"
          class="mx-auto mb-4 h-auto w-full rounded" />
        <h2 class="mb-2 text-lg font-semibold">{car.model}</h2>
        <p>{car.description}</p>
        <button
          on:click={showPopup(car)}
          class="btn mx-auto mt-2 block bg-tertiary-500">
          Show Details
        </button>
      </div>
    </div>
  {/each}
</div>

<Paginator
  bind:settings={paginationSettings}
  showFirstLastButtons={false}
  showPreviousNextButtons={true}
  amountText="Cars" />
