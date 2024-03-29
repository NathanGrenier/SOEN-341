<script lang="ts">
  import {
    type PaginationSettings,
    type ModalComponent,
    type ToastSettings,
    getModeUserPrefers,
  } from "@skeletonlabs/skeleton";
  import {
    getModalStore,
    type ModalSettings,
    Paginator,
  } from "@skeletonlabs/skeleton";
  import { TreeView, TreeViewItem } from "@skeletonlabs/skeleton";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import type { Car } from "@prisma/client";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import ViewCarModal from "$lib/components/modals/ViewCarModal.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import flatpickr from "flatpickr";
  import { modeCurrent } from "@skeletonlabs/skeleton";

  export let data;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let { cars } = data;
  const maximumPrice = Math.max(...cars.map((car) => car.dailyPrice)) / 100;
  const minimumPrice = Math.min(...cars.map((car) => car.dailyPrice)) / 100;
  let values = [minimumPrice, maximumPrice];
  let { branches } = data;
  let selectedCarColour = "No Specific Color";
  let selectedBranch = Number(data.branchId) || -1;
  let isLoading = false;

  let startDate: Date;
  let endDate: Date;
  let ref: Node;
  let disableFilterButton = false;

  let themeMode = getModeUserPrefers() ? "material_blue" : "dark";

  $: {
    themeMode = $modeCurrent ? "material_blue" : "dark";
    onMount(() => {
      const link = document.getElementById(
        "flatpickr-theme",
      ) as HTMLAnchorElement;
      link.href = `https://npmcdn.com/flatpickr/dist/themes/${themeMode}.css`;
    });
  }

  const uniqueColors = [...new Set(cars.map((car) => car.colour))];

  onMount(() => {
    if ($page.url.searchParams.get("carId")) {
      const popUpCar = cars.find(
        (car) => car.id == Number($page.url.searchParams.get("carId")),
      );

      if (!popUpCar) return;

      showPopup(popUpCar);
    }

    flatpickr(ref, {
      allowInput: true,
      clickOpens: true,
      minDate: new Date(),
      static: true,
      mode: "range",
      enableTime: true,
      position: "below center",
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          startDate = selectedDates[0];
          endDate = selectedDates[1];
          disableFilterButton = false;
        } else {
          disableFilterButton = true;
        }
      },
    });
  });

  $: paginatedCars = cars.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit +
      paginationSettings.limit,
  );

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
      response: (r: boolean | undefined) => {
        if (!r) goto("/browse-vehicles");
      },
    };

    modalStore.trigger(modal);

    goto(`/browse-vehicles?carId=${car.id}`);

    return null;
  }

  function handleFilter(): void {
    if ((startDate && !endDate) || (!startDate && endDate)) return;
    cars = [];
    isLoading = true;
    const formData = new FormData();

    if (selectedCarColour !== "No Specific Colour")
      formData.append("colour", selectedCarColour);

    formData.append("minPrice", values[0].toString());
    formData.append("maxPrice", values[1].toString());

    if (startDate && endDate) {
      formData.append("startDate", startDate.toISOString());
      formData.append("endDate", endDate.toISOString());
    }

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

        const fetchedCars = [];

        for (const item of jsonData) {
          const parsedItem = JSON.parse(item);
          fetchedCars.push(parsedItem);
        }

        const flattenedCars = fetchedCars.reduce((acc, current) => {
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

<link
  rel="stylesheet"
  type="text/css"
  href="https://npmcdn.com/flatpickr/dist/themes/{themeMode}.css"
  id="flatpickr-theme" />

<div class="card my-2 space-y-2 pb-2 pr-4">
  <TreeView>
    <TreeViewItem>
      <h6 class="h6 font-bold">Search Filters</h6>
      <svelte:fragment slot="children">
        <div class="space-y-4">
          <label class="label mt-2">
            <span>Car Color</span>
            <select class="select" bind:value={selectedCarColour}>
              <option value={"No Specific Color"}>No Specific Color</option>
              {#each uniqueColors as colour}
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
          <div class="row py-6">
            <p class="pb-6">Minimum and Maximum Price</p>
            <RangeSlider
              bind:values
              min={minimumPrice}
              max={maximumPrice}
              range
              pips
              pushy
              pipstep={40}
              float
              first="label"
              suffix="$"
              last="label" />
          </div>
          <div>
            <label class="label">
              <span>Start and End Dates</span>
              <input
                class="center input mx-auto ml-4 mt-4 w-60 sm:w-80"
                bind:this={ref} />
            </label>
          </div>
          <button
            class="btn mx-auto block w-20 bg-primary-500"
            on:click={handleFilter}
            disabled={disableFilterButton}>Filter</button>
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
    <p class="card my-12 p-4">No cars found</p>
  </div>
{/if}

<div class="my-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {#each paginatedCars as car}
    <div class="card p-4">
      <img
        src={car.photoUrl || "https://placehold.co/600x400"}
        alt="Car"
        class="mx-auto mb-4 h-auto w-full rounded" />
      <h2 class="mb-2 text-lg font-semibold">{car.model}</h2>
      <p>{car.description}</p>
      <button
        on:click={showPopup(car)}
        class="btn mx-auto mt-2 block bg-primary-500">
        Show Details
      </button>
    </div>
  {/each}
</div>

<Paginator
  bind:settings={paginationSettings}
  showFirstLastButtons={false}
  showPreviousNextButtons={true}
  amountText="Cars" />

<style>
  :root {
    --range-slider: hwb(180 46% 51%);
    --range-handle-inactive: hsl(180, 4.6%, 61.8%);
    --range-handle: neon-green;
    --range-handle-focus: hsl(244.1, 63.2%, 54.1%);
    --range-handle-border: neon-green;
    --range-range-inactive: hsl(180, 4.6%, 61.8%);
    --range-range: hsl(244.1, 63.2%, 54.1%);
    --range-float-inactive: hsl(180, 4.6%, 61.8%);
    --range-float: hsl(244.1, 63.2%, 54.1%);
    --range-float-text: hsl(0, 0%, 100%);

    --range-pip: hsl(210, 14.3%, 53.3%);
    --range-pip-text: hsl(211, 38%, 75%);
    --range-pip-active: hsl(180, 25.4%, 24.7%);
    --range-pip-active-text: hsl(180, 39%, 60%);
    --range-pip-hover: hsl(180, 25.4%, 24.7%);
    --range-pip-hover-text: hsl(180, 25.4%, 24.7%);
    --range-pip-in-range: hsl(123, 70%, 42%);
    --range-pip-in-range-text: hsl(180, 25.4%, 24.7%);
  }
</style>
