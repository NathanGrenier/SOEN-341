<script lang="ts">
  import {
    DefaultMarker,
    MapLibre,
    Popup,
    type Map as SvelteMap,
  } from "svelte-maplibre";
  import {
    Paginator,
    modeCurrent,
    type PaginationSettings,
  } from "@skeletonlabs/skeleton";
  import { goto } from "$app/navigation";
  import type { Branch } from "@prisma/client";
  import { tweened } from "svelte/motion";
  import { quadInOut } from "svelte/easing";
  import MapLibreGlDirections, {
    LoadingIndicatorControl,
  } from "@maplibre/maplibre-gl-directions";
  import type { Map } from "maplibre-gl";

  export let data;

  let lineWidth = tweened(2);
  const targetLineWidth = 4;

  function tweenLineWidth() {
    lineWidth.set(targetLineWidth).then(() => {
      lineWidth.set(2);
      setTimeout(tweenLineWidth, 1000);
    });
  }

  tweenLineWidth();

  let directions: MapLibreGlDirections;
  let currentLngLatDoneUpdating = false;
  let currentAddressInput: string;
  let userLocationGeoJSON: {
    coordinates: [number, number];
    type?: string;
  } | null = null;
  let closestBranchGeoJSON: {
    coordinates: [number, number];
    type?: string;
  } | null = null;
  let displayClosestBranch = false;

  let currentTheme = $modeCurrent ? "voyager" : "dark-matter";
  let currentLatitude = tweened(-73.7, {
    easing: quadInOut,
    duration: 200,
  });
  let currentLongitude = tweened(45.55, {
    easing: quadInOut,
    duration: 200,
  });
  let zoom = tweened(10, {
    easing: quadInOut,
    duration: 100,
  });
  let currentZoom = $zoom;

  let map: SvelteMap & Map;
  let renderMap = true;
  let center = { lng: $currentLatitude, lat: $currentLongitude };

  let branches = data.branches;
  let paginatedBranches: Branch[];
  let paginationSettings = {
    page: 0,
    limit: 2,
    size: branches.length,
    amounts: [1, 2],
  } satisfies PaginationSettings;

  $: {
    currentTheme = $modeCurrent ? "voyager" : "dark-matter";
    if ($modeCurrent !== undefined) {
      renderMap = false;
      setTimeout(() => {
        renderMap = true;
      }, 1);
    }
  }

  $: {
    if (displayClosestBranch && userLocationGeoJSON && closestBranchGeoJSON) {
      map.addControl(new LoadingIndicatorControl(directions));

      directions.hoverable = true;

      directions.clear();

      directions.setWaypoints([
        userLocationGeoJSON.coordinates,
        closestBranchGeoJSON.coordinates,
      ]);
    }
  }

  $: currentZoom = $zoom;

  $: {
    if (currentLngLatDoneUpdating) {
      center = { lng: $currentLatitude, lat: $currentLongitude };
    }
  }

  $: paginatedBranches = branches.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit +
      paginationSettings.limit,
  );

  function locateBranchOnMap(longitude: number, latitude: number) {
    currentLngLatDoneUpdating = false;
    currentLongitude.set(map.getCenter().lat).then(() => {
      currentLongitude.update(() => {
        return latitude;
      });
    });
    currentLatitude.set(map.getCenter().lng).then(() => {
      currentLatitude.update(() => {
        currentLngLatDoneUpdating = true;
        return longitude;
      });
    });
    return null;
  }

  function redirectWithBranch(id: number) {
    goto(`/browse-vehicles?branchId=${id}`);
    return null;
  }

  async function fetchGeocode(address: string) {
    const apiKey = "6612ab04bca11530951542nqjc9587a";
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          updateNearestBranch(lat, lon);
        } else {
          console.error("No geocode found for the entered address.");
        }
      } else {
        console.error("Failed to fetch geocode:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
  }

  function updateNearestBranch(latitude: number, longitude: number) {
    let nearestBranchIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      const distance = calculateDistance(
        latitude,
        longitude,
        branch.latitude,
        branch.longitude,
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestBranchIndex = i;
      }
    }

    const nearestBranch = branches[nearestBranchIndex];

    if (nearestBranchIndex !== -1) {
      paginatedBranches = [branches[nearestBranchIndex]];
      currentLongitude.set(nearestBranch.latitude);
      currentLatitude.set(nearestBranch.longitude);
      zoom.set(10);
    }

    userLocationGeoJSON = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    closestBranchGeoJSON = {
      type: "Point",
      coordinates: [nearestBranch.longitude, nearestBranch.latitude],
    };

    // Optionally add the standard loading-indicator control
    map.addControl(new LoadingIndicatorControl(directions));

    directions.hoverable = true;

    directions.clear();

    // Set the waypoints programmatically
    directions.setWaypoints([
      userLocationGeoJSON.coordinates,
      closestBranchGeoJSON.coordinates,
    ]);
  }

  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const address = formData.get("address") as string;
    if (address.trim() !== "") {
      await fetchGeocode(address);
      displayClosestBranch = true;
    } else {
      console.error("Please enter a valid address.");
    }
  }

  function displayAllBranches() {
    displayClosestBranch = false;
    paginatedBranches = branches.slice(
      paginationSettings.page * paginationSettings.limit,
      paginationSettings.page * paginationSettings.limit +
        paginationSettings.limit,
    );
    directions.clear();
    currentAddressInput = "";
  }
</script>

<link
  rel="stylesheet"
  type="text/css"
  href="https://npmcdn.com/maplibre-gl/dist/maplibre-gl.css"
  id="maplibre-css" />

<div class="grid w-11/12 grid-cols-1 gap-4 sm:grid-cols-4">
  <div class="col-span-1 sm:col-span-3">
    <div class="relative aspect-[9/20] h-full sm:aspect-[16/11]">
      {#if renderMap}
        <MapLibre
          bind:map
          on:load={() => {
            directions = new MapLibreGlDirections(map);
          }}
          bind:center
          bind:zoom={currentZoom}
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
          {/each}
        </MapLibre>
      {/if}
    </div>
  </div>

  <div class="col-span-1 w-auto sm:w-96">
    <div class="card relative h-full p-4">
      <div class="flex justify-center">
        <h2 class="h2 mb-4 text-lg font-semibold">
          Find a Branch{displayClosestBranch
            ? " - Displaying Closest Branch"
            : " - Displaying All Branches"}
        </h2>
      </div>
      <div class="card my-2 p-2">
      <form on:submit={handleSubmit}>
        <div class="flex justify-between space-x-2">
          <input
            type="text"
            name="address"
            placeholder="Enter address"
            class="input"
            bind:value={currentAddressInput} />
          <button type="submit" class="btn bg-primary-500">Submit</button>
        </div>
      </form>
      {#if branches.length === 0}
        <div class="p-4 text-center">No Branches Found</div>
      {/if}
      <div class="my-2 space-y-10 p-2">
        {#each paginatedBranches as branch}
          <div class="card p-4">
            <div>
              <h2 class="text-xl font-semibold">{branch.name}</h2>
              <p class="my-2">{branch.streetAddress}</p>
              <p>
                {branch.city}, {branch.region}, {branch.country}, {branch.postalCode}
              </p>
            </div>
            <div class="justify-center sm:flex sm:space-x-2">
              <button
                class="btn mx-auto mt-4 block bg-primary-500"
                on:click={locateBranchOnMap(branch.longitude, branch.latitude)}>
                Locate on Map
              </button>
              <button
                class="btn mx-auto mt-4 block bg-primary-500"
                on:click={redirectWithBranch(branch.id)}>
                Select Branch
              </button>
            </div>
          </div>
        {/each}
      </div>
      {#if displayClosestBranch}
        <button
          on:click={displayAllBranches}
          class="btn mx-auto block bg-primary-500"
          ><p>Display All Branches?</p></button>
      {/if}
      <div class="bottom-5 ml-4 sm:absolute">
        <Paginator
          bind:settings={paginationSettings}
          showFirstLastButtons={false}
          showPreviousNextButtons={true}
          amountText="Branches" />
      </div>
    </div>
  </div>
</div>
