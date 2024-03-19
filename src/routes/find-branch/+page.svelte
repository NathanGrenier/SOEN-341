<script lang="ts">
  import { DefaultMarker, MapLibre, Popup } from "svelte-maplibre";
  import {
    Paginator,
    modeCurrent,
    type PaginationSettings,
  } from "@skeletonlabs/skeleton";
  import { goto } from "$app/navigation";

  export let data;

  let currentTheme = $modeCurrent ? "voyager" : "dark-matter";
  const { branches } = data;
  let currentLatitude = -73.7;
  let currentLongitude = 45.55;
  let center: {
    lng: number;
    lat: number;
  };
  let zoom: number;
  let currentZoom = 9.6;

  $: zoom = currentZoom;

  $: {
    currentTheme = $modeCurrent ? "voyager" : "dark-matter";
  }

  $: center = { lng: currentLatitude, lat: currentLongitude };

  $: paginatedBranches = branches.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit +
      paginationSettings.limit,
  );

  let paginationSettings = {
    page: 0,
    limit: 2,
    size: branches.length,
    amounts: [1, 2],
  } satisfies PaginationSettings;

  function locateBranchOnMap(longitude: number, latitude: number) {
    center.lng = longitude;
    center.lat = latitude;
    zoom = 10;
    return null;
  }

  function redirectWithBranch(id: number) {
    goto(`/browse-vehicles?branchId=${id}`);

    return null;
  }
</script>

<link
  rel="stylesheet"
  type="text/css"
  href="https://npmcdn.com/maplibre-gl/dist/maplibre-gl.css"
  id="maplibre-css" />

<div class="grid grid-cols-4 gap-4 overflow-hidden">
  <div class="col-span-3">
    <div class="relative aspect-[16/11] h-full">
      <MapLibre
        {center}
        {zoom}
        standardControls
        style="https://basemaps.cartocdn.com/gl/{currentTheme}-gl-style/style.json"
        >{#each branches as branch}
          <DefaultMarker
            lngLat={{ lng: branch.longitude, lat: branch.latitude }}
            ><Popup offset={[0, -10]}>
              <div class="card p-4">
                <div class="col-span-5">
                  <h2 class="text-xl font-semibold">{branch.name}</h2>
                  <p class="my-2">{branch.streetAddress}</p>
                  <p>
                    {branch.city}, {branch.region}, {branch.country}, {branch.postalCode}
                  </p>
                </div>
                <button
                  class="btn mx-auto mt-4 block bg-primary-500"
                  on:click={() => redirectWithBranch(branch.id)}
                  >Select Branch</button>
              </div>
            </Popup>
          </DefaultMarker>
        {/each}</MapLibre>
    </div>
  </div>

  <div class="col-span-1">
    <div class="card relative h-full p-4">
      <div class="flex justify-center">
        <h2 class="h2 mb-4 text-lg font-semibold">Find a Branch</h2>
      </div>
      <div class="card my-2 p-2">
        {#each paginatedBranches as branch}
          <div class="grid grid-cols-6 p-4">
            <div class="col-span-1 my-auto justify-center">
              <p>{branch.id}</p>
            </div>
            <div class="col-span-5">
              <h2 class="text-xl font-semibold">{branch.name}</h2>
              <p class="my-2">{branch.streetAddress}</p>
              <p>
                {branch.city}, {branch.region}, {branch.country}, {branch.postalCode}
              </p>
            </div>
            <div class="col-span-6 flex justify-center space-x-2">
              <button
                class="btn mt-4 block bg-primary-500"
                on:click={locateBranchOnMap(branch.longitude, branch.latitude)}
                >Locate on Map</button>
              <button
                class="btn mt-4 block bg-primary-500"
                on:click={redirectWithBranch(branch.id)}>Select Branch</button>
            </div>
          </div>
        {/each}
      </div>
      <div class="absolute bottom-5">
        <Paginator
          bind:settings={paginationSettings}
          showFirstLastButtons={false}
          showPreviousNextButtons={true}
          amountText="Branches" />
      </div>
    </div>
  </div>
</div>
