<script lang="ts">
  import { onMount } from "svelte";

  let filteredColor = "";
  let filteredPrice = 0;

  export let data;

  let { cars } = data;

  onMount(async () => {
    if (!cars) {
      window.location.href = "/";
    }
  });

  function redirectToBooking(carId: string, branchId: string) {
    const dateRange = generateRandomDate();
    const redirectUrl = `/reserve/${carId}/${dateRange}/${branchId}`;
    window.location.href = redirectUrl;
  }

  function generateRandomDate() {
    const today = new Date();
    const randomFutureStartDate = new Date(
      today.getTime() + Math.random() * 26 * 24 * 60 * 60 * 1000,
    ); // Random date in the next 26 days to ensure a five-day range
    const randomFutureEndDate = new Date(
      randomFutureStartDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000,
    ); // Random date within the next 5 days for end date
    const startDateYear = randomFutureStartDate.getFullYear();
    const startDateMonth = String(
      randomFutureStartDate.getMonth() + 1,
    ).padStart(2, "0");
    const startDateDay = String(randomFutureStartDate.getDate()).padStart(
      2,
      "0",
    );
    const endDateYear = randomFutureEndDate.getFullYear();
    const endDateMonth = String(randomFutureEndDate.getMonth() + 1).padStart(
      2,
      "0",
    );
    const endDateDay = String(randomFutureEndDate.getDate()).padStart(2, "0");
    return `${startDateYear}-${startDateMonth}-${startDateDay}~${endDateYear}-${endDateMonth}-${endDateDay}`;
  }

  function showPopup(index: number) {
    const popup = document.getElementById(`popupCard_${index}`);
    if (popup) {
      popup.style.display = "block";
    }
  }

  function closePopup(index: number) {
    const popup = document.getElementById(`popupCard_${index}`);
    if (popup) {
      popup.style.display = "none";
    }
  }
</script>

{#if cars !== undefined}
  <div class="filter-container mb-6 flex items-center">
    <select bind:value={filteredColor} class="mr-4">
      <option value="">All Colors</option>
      {#each Array.from(new Set(cars?.map((car) => car.colour))) as color}
        <option value={color}>{color}</option>
      {/each}
    </select>

    <input
      type="range"
      min="0"
      max="2000"
      step="1"
      bind:value={filteredPrice}
      class="price-slider mr-4" />
    <span class="price-display">${filteredPrice}</span>
  </div>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each cars as car, index}
      {#if (!filteredColor || car.colour === filteredColor) && (!filteredPrice || car.dailyPrice <= filteredPrice)}
        <div class="rounded-lg bg-white shadow-md">
          <div class="p-4">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img
              src={car.photoUrl}
              alt="Image of a car"
              class="mx-auto mb-4 h-40 w-auto" />
            <h2 class="mb-2 text-lg font-semibold">{car.model}</h2>
            <p class="text-gray-600">{car.description}</p>
            <button
              on:click={() => showPopup(index)}
              class="mt-2 block w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-transform hover:translate-y-1 focus:outline-none focus:ring focus:ring-blue-400">
              Show Details
            </button>
          </div>
        </div>
        <div
          id={`popupCard_${index}`}
          class="rounded-lg bg-white p-4 shadow-lg"
          style="display: none;">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-interactive-supports-focus -->
          <span
            role="button"
            class="closeButton absolute right-2 top-2 cursor-pointer text-gray-500"
            on:click={() => closePopup(index)}>&times;</span>
          <h2 class="mb-4 text-lg font-semibold">
            {car.year + " " + car.make + " " + car.model}
          </h2>
          <p class="mb-2 text-gray-600">Color: {car.colour}</p>
          <p class="mb-2 text-gray-600">Number of seats: {car.seats}</p>
          <p class="mb-2 text-gray-600">Daily Price$: {car.dailyPrice}</p>
          <button
            on:click={() =>
              redirectToBooking(car.id.toString(), car.branchId.toString())}
            class="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-transform hover:translate-y-1 focus:outline-none focus:ring focus:ring-blue-400">
            Book Now
          </button>
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .filter-container {
    margin-bottom: 20px;
  }

  .filter-container select {
    padding: 8px;
    font-size: 14px;
    margin-right: 10px;
  }

  .closeButton {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 24px;
    color: #999;
  }

  .closeButton:hover {
    color: #333;
  }

  .price-slider {
    width: 200px;
    margin-left: 10px;
  }

  .price-display {
    margin-left: 10px;
  }
</style>
