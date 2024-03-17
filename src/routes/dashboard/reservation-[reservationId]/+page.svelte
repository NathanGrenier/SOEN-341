<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  const {
    reservation,
    reservation: {
      car,
      car: { branch },
    },
  } = data;
</script>

<div class="flex flex-col gap-2">
  <div class="card">
    <header class="card-header">
      <h2 class="text-lg font-bold">
        {`${car.make} ${car.model} ${car.year}`}
      </h2>
    </header>
    <section class="p-4">
      <div class="grid">
        <div class="grid-item">
          <!-- TODO: Change the url to the actual path -->

          <a class="card card-hover" href={`/cars/${car.id}`}>
            <!-- TODO: Change the url to `{car.photoURL}`-->
            <img
              src="../../../tempCar.png"
              class="h-auto max-h-64 w-full rounded-md"
              alt={`${car.make} ${car.model} ${car.year}`} />
          </a>
        </div>
        <div class="grid-item">
          <h3 class="text-lg font-bold">Reservation Details</h3>
          <input
            class="input"
            title="Date and time of planned departure"
            bind:value={reservation.plannedDepartureAt}
            type="datetime-local" />
          <p>{reservation.plannedDepartureAt}</p>
          <p>{reservation.plannedReturnAt}</p>
          <p>${(reservation.quotedPrice / 100).toFixed(2)}</p>
        </div>

        <div class="grid-item">
          <h3 class="text-lg font-bold">Branch Details</h3>
          <p>{branch.name}</p>
          <p>{branch.streetAddress}</p>
          <p>{branch.city}</p>
          <p>{branch.region}</p>
          <p>{branch.postalCode}</p>
        </div>
        <div class="grid-item">
          <h3 class="text-lg font-bold">Branch Location</h3>
        </div>
      </div>
    </section>
    <footer class="card-footer">(footer)</footer>
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Define 2 columns */
    gap: 10px; /* Define the gap between grid items */
  }

  .grid-item {
    width: 100%; /* Make the grid item take up the full width of its grid cell */
    /* aspect-ratio: 1 / 1; Make the grid item a square */
  }
</style>
