<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import type { Branch } from "@prisma/client";
  import "leaflet/dist/leaflet.css";
  import type { Map, Marker, PopupEvent } from "leaflet";

  let map: Map;
  export let branches: Branch[];
  export let selectedBranchId: number;

  const dispatch = createEventDispatcher();

  // Initialize the map when the component mounts
  onMount(async () => {
    const L = await import("leaflet");

    map = L.map("map").setView([45.508888, -73.561668], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; OpenStreetMap contributors, Tiles courtesy of OpenStreetMap",
    }).addTo(map);

    branches.forEach((branch: Branch) => {
      let popupContent = `
        <div class="text-center space-y-2">
          <strong>${branch.name}</strong>
          <p>Address: ${branch.streetAddress}</p>
          <button class="btn variant-filled select-button">${selectedBranchId === branch.id ? "Unselect" : "Select"}</button>
        </div>
      `;

      let marker = L.marker([branch.latitude, branch.longitude])
        .addTo(map)
        .bindPopup(popupContent)
        .on("popupopen", (event: PopupEvent) => {
          let popup = event.target.getPopup();
          if (popup) {
            let selectButton = popup
              .getElement()
              .querySelector(".select-button");
            selectButton.textContent =
              selectedBranchId === branch.id ? "Unselect" : "Select";
            if (selectButton) {
              selectButton.addEventListener("click", () => {
                handleSelect(branch.id, marker, selectButton);
              });
            }
          }
        });

      // Set marker color if the branch is selected
      if (selectedBranchId === branch.id) {
        marker.setIcon(
          L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        );
      }
    });
  });

  async function handleSelect(
    branchId: number,
    marker: Marker,
    selectButton: HTMLElement,
  ) {
    const L = await import("leaflet");

    // Toggle button text between "Select" and "Unselect" based on current selection
    if (selectButton.textContent === "Select") {
      selectedBranchId = branchId;
      selectButton.textContent = "Unselect";
      // Change marker color to red
      marker.setIcon(
        L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      );
    } else {
      selectButton.textContent = "Select";
      selectedBranchId = -1;
      // Change marker color to default (blue or green)
      marker.setIcon(
        L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        }),
      );
    }

    // Dispatch branchId
    dispatch("branchSelected", { selectedBranchId });
  }
</script>

<div id="map" class=""></div>

<style>
  #map {
    height: 400px;
  }
</style>
