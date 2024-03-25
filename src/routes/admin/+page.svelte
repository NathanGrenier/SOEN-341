<script lang="ts">
  import userModal from "./crud-forms/user-form.svelte";
  import carModal from "./crud-forms/car-form.svelte";
  import resModal from "./crud-forms/reservation-form.svelte";
  import Datatable from "./Datatable.svelte";
  import {
    getModalStore,
    type ModalComponent,
    type ModalSettings,
  } from "@skeletonlabs/skeleton";
  import { fetchEntities } from "$lib/model/entityModal";

  const modalStore = getModalStore();

  function executeUserEditModal(id: number, mode: string) {
    const modalComponent: ModalComponent = {
      ref: userModal,
      props: { id: id, mode: mode },
    };

    const userEditModal: ModalSettings = {
      type: "component",
      component: modalComponent,
      response: () => fetchDataAndHandle("User"),
    };
    modalStore.trigger(userEditModal);
  }

  function executeCarEditModal(id: number, mode: string) {
    const modalComponent: ModalComponent = {
      ref: carModal,
      props: { id: id, mode: mode },
    };

    const carEditModal: ModalSettings = {
      type: "component",
      component: modalComponent,
      response: () => fetchDataAndHandle("Car"),
    };
    modalStore.trigger(carEditModal);
  }

  function executeResEditModal(id: number, mode: string) {
    const modalComponent: ModalComponent = {
      ref: resModal,
      props: { id: id, mode: mode },
    };

    const resEditModal: ModalSettings = {
      type: "component",
      component: modalComponent,
      response: () => fetchDataAndHandle("Reservation"),
    };
    modalStore.trigger(resEditModal);
  }

  async function fetchDataAndHandle(entityName: string) {
    const result = await fetchEntities(entityName);

    if (result.flattenedEntities) {
      fetchedData = result.flattenedEntities;
    }

    restart();

    switch (entityName) {
      case "User":
        selectedKey = 1;
        break;

      case "Car":
        selectedKey = 2;
        break;
      case "Reservation":
        selectedKey = 3;
        break;

      default:
        selectedKey = -1;
        break;
    }

    isSelected = true;

    selectedRowId = -1;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchedData: any;

  $: selectedKey = -1;
  $: isSelected = false;

  let selectedRowId: number = -1;
  let selectedData: ArrayLike<unknown> | { [s: string]: unknown };

  function handleRowClick(event: { detail: number }) {
    selectedRowId = event.detail;
    selectedData = fetchedData.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: { id: any }) => item.id === selectedRowId,
    );
    if (selectedKey === 1) {
      executeUserEditModal(selectedRowId, "edit");
    } else if (selectedKey === 2) {
      executeCarEditModal(selectedRowId, "edit");
    } else if (selectedKey === 3) {
      executeResEditModal(selectedRowId, "edit");
    } else {
      console.log("Error: No key / button / type selected.");
    }
    console.log(selectedData);
  }

  let unique = {};

  function restart() {
    unique = {};
  }
</script>

<div class="card">
  <header class="card-header text-center font-bold">
    <h1 class="h1 p-5">Admin Dashboard</h1>
  </header>
  <div class="container flex flex-col space-y-10 p-5">
    <div class="card flex flex-col space-y-10 p-10">
      <div class="container">
        {#if isSelected == true}
          {#key unique}
            <div class="container">
              <Datatable
                fetchCase={selectedKey}
                on:rowClick={handleRowClick}
                userData={fetchedData} />
              <button
                on:click={() => {
                  if (selectedKey === 1) {
                    executeUserEditModal(-1, "create");
                  } else if (selectedKey === 2) {
                    executeCarEditModal(-1, "create");
                  } else if (selectedKey === 3) {
                    executeResEditModal(-1, "create");
                  } else {
                    console.log("Error: No key / button / type selected.");
                  }
                }}
                type="button"
                class="variant-filled btn float-right mt-4 font-bold">
                New Entry
              </button>
            </div>
          {/key}
        {:else}
          <h3 class="h3 text-center font-bold">
            Please select an option to fetch the table.
          </h3>
        {/if}
      </div>
      <div class="container">
        <div
          class="container justify-center space-x-2 space-y-4 font-bold sm:flex sm:flex-row">
          <div>
            <button
              type="button"
              class="variant-filled btn mx-auto mt-4 block"
              on:click={() => fetchDataAndHandle("User")}
              >Load all Users</button>
          </div>
          <div>
            <button
              type="button"
              on:click={() => fetchDataAndHandle("Car")}
              class="variant-filled btn mx-auto my-auto block"
              >Load all Cars</button>
          </div>
          <div>
            <button
              type="button"
              on:click={() => fetchDataAndHandle("Reservation")}
              class="variant-filled btn mx-auto my-auto block"
              >Load all Reservations</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
