<script lang="ts">
  import type { PageData } from "./$types";
  import SeparatedText from "./SeparatedText.svelte";
  import EditIcon from "$lib/icons/EditIcon.svelte";

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
      <div class="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-2">
        <div class="grid-item grid- row-span-2 w-full">
          <a class="card card-hover" href={`/cars/${car.id}`}>
            <img
              src={car.photoUrl}
              class="h-full w-full rounded-lg"
              alt={`${car.make} ${car.model} ${car.year}`} />
          </a>
        </div>
        <div class="grid-item">
          <div class="flex items-center justify-between">
            <h2 class=" text-2xl font-bold">Reservation Details</h2>
            <button class="variant-filled-primary btn w-fit self-end"
              ><EditIcon invertColor={true} constColor={true} /><span
                >Modify</span
              ></button>
          </div>
          <div class="mt-2 flex flex-col gap-1">
            <input
              class="input"
              title="Date and time of planned departure"
              bind:value={reservation.plannedDepartureAt}
              type="datetime-local" />
            <p>{reservation.plannedDepartureAt}</p>
            <p>{reservation.plannedReturnAt}</p>
            <p>${(reservation.quotedPrice / 100).toFixed(2)}</p>
          </div>
        </div>

        <div class="grid-item">
          <h2 class="text-2xl font-bold">Branch Details</h2>
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
