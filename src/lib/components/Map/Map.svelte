<script lang="ts">
  import { onMount } from "svelte";
  import type { Branch } from "@prisma/client";
  import type { Map } from "leaflet";
  import markerIconUrl from "../../../../node_modules/leaflet/dist/images/marker-icon.png";
  import markerIconRetinaUrl from "../../../../node_modules/leaflet/dist/images/marker-icon-2x.png";
  import markerShadowUrl from "../../../../node_modules/leaflet/dist/images/marker-shadow.png";

  let map: Map;
  export let branches: Branch[];

  // Initialize the map when the component mounts
  onMount(async () => {
    const L = await import("leaflet");

    map = L.map("map").setView([45.508888, -73.561668], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; OpenStreetMap contributors, Tiles courtesy of OpenStreetMap",
    }).addTo(map);

    L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
    L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
    L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
    L.Icon.Default.imagePath = "";

    branches.forEach((branch: Branch) => {
      let popupContent = `
        <div class="text-center space-y-2">
          <strong>${branch.name}</strong>
          <p>Address: ${branch.streetAddress}</p>
        </div>
      `;

      L.marker([branch.latitude, branch.longitude])
        .addTo(map)
        .bindPopup(popupContent);
    });
  });
</script>

<div id="map" class=""></div>

<style>
  #map {
    height: 400px;
  }
</style>
