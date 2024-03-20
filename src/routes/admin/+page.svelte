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
  import { getToastStore } from "@skeletonlabs/skeleton";

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  function executeUserEditModal(id: number, mode: string) {
    const modalComponent: ModalComponent = {
      ref: userModal,
      props: { id: id, mode: mode },
    };

    const userEditModal: ModalSettings = {
      type: "component",
      component: modalComponent,
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
    };
    modalStore.trigger(resEditModal);
  }

  export let data;

  let allUsers = data.allUsers;
  let allVehicles = data.allCars;
  let allReservations = data.allReservations;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchedData: any;
  let isLoading = false;

  async function fetchUserData() {
    isLoading = true;
    fetchedData = allUsers;
    isLoading = false;
  }

  async function fetchVehicleData() {
    isLoading = true;
    fetchedData = allVehicles;
    isLoading = false;
  }

  async function fetchReservationData() {
    isLoading = true;
    fetchedData = allReservations;
    console.log(fetchedData);
    isLoading = false;
  }

  // TO-DO: MAKE USE OF THIS FUNCTION TO CREATE

  // async function createEntity(entityName: string, formData: FormData) {
  //   try {
  //     const createResponse = await fetch(`/admin?/create${entityName}`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!createResponse.ok) {
  //       throw new Error(`There was an error creating ${entityName}`);
  //     }

  //     const createData = await createResponse.json();

  //     // Trigger success toast
  //     toastStore.trigger({
  //       message: `${entityName} has been successfully created`,
  //       classes: "bg-success-500",
  //     });

  //     // Fetch all entities after creation
  //     const blankFormData = new FormData();
  //     blankFormData.append("message", `Fetching all ${entityName}s`);
  //     const fetchResponse = await fetch(`?/getAll${entityName}s`, {
  //       method: "POST",
  //       body: blankFormData,
  //     });

  //     if (!fetchResponse.ok) {
  //       throw new Error(`There was an error fetching ${entityName}s`);
  //     }

  //     const fetchData = await fetchResponse.json();

  //     // Process fetched data
  //     const jsonData = JSON.parse(fetchData.data);
  //     const fetchedEntities = jsonData.map((item: string) => JSON.parse(item));
  //     const flattenedEntities = fetchedEntities.reduce(
  //       (acc: any[], current: any) => acc.concat(current),
  //       [],
  //     );

  //     // Update state with fetched data
  //     isLoading = true;
  //     fetchedData = flattenedEntities;

  //     // Introduce a slight delay before setting isLoading back to false
  //     setTimeout(() => {
  //       isLoading = false;
  //     }, 100);

  //     // Trigger success toast
  //     toastStore.trigger({
  //       message: `${entityName}s have been successfully fetched`,
  //       classes: "bg-success-500",
  //     });
  //   } catch (error) {
  //     // Trigger error toast
  //     toastStore.trigger({
  //       message: `There was an error: ${error.message}`,
  //       classes: "bg-error-500",
  //     });

  //     console.error(error);
  //   }
  // }

  async function updateEntity(entityName: string, finalizedForm: FormData) {
    try {
      const updateResponse = await fetch(`/admin?/update${entityName}`, {
        method: "POST",
        body: finalizedForm,
      });

      if (!updateResponse.ok) {
        throw new Error("There was an error updating the entity");
      }

      await updateResponse.json();

      // Trigger success toast
      toastStore.trigger({
        message: `${entityName} has been successfully updated`,
        classes: "bg-success-500",
      });

      // Fetch all entities
      const blankFormData = new FormData();
      blankFormData.append("message", `Fetching all ${entityName}`);
      const fetchResponse = await fetch(`?/getAll${entityName}s`, {
        method: "POST",
        body: blankFormData,
      });

      if (!fetchResponse.ok) {
        throw new Error(`There was an error fetching ${entityName}`);
      }

      const fetchData = await fetchResponse.json();

      // Process fetched data
      const jsonData = JSON.parse(fetchData.data);
      const fetchedEntities = jsonData.map((item: string) => JSON.parse(item));
      const flattenedEntities = fetchedEntities.reduce(
        (acc, current) => acc.concat(current),
        [],
      );

      // Update state with fetched data
      isLoading = true;
      fetchedData = flattenedEntities;
      setTimeout(() => {
        isLoading = false;
      }, 100);

      // Trigger success toast
      toastStore.trigger({
        message: `${entityName}s has been successfully fetched`,
        classes: "bg-success-500",
      });
    } catch (error) {
      // Trigger error toast
      toastStore.trigger({
        message: `There was an error: ${error.message}`,
        classes: "bg-error-500",
      });

      console.error(error);
    }
  }

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let formElement: any;

  async function handleSubmit() {
    let formData = new FormData(formElement);
    let data = Object.fromEntries(formData.entries());

    const convertValue = (value) => {
      // Check if the value is an empty string and return it as is
      if (value === "") return value;

      // Attempt to convert to a Number
      const numberValue = Number(value);
      if (!isNaN(numberValue) && value !== "") return numberValue; // Return the number if it's a valid conversion

      // Attempt to convert to a Boolean
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;

      // Default to string if no other conversions apply
      return value;
    };

    let convertedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, convertValue(value)]),
    );

    function convertToFormData(
      data: ArrayLike<unknown> | { [s: string]: unknown },
    ) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      return formData;
    }

    isLoading = true;
    try {
      if (selectedKey === 1) {
        let finalizedForm = convertToFormData(convertedData);
        finalizedForm.append("userId", selectedRowId.toString());
        updateEntity("User", finalizedForm);
        restart();
      } else if (selectedKey === 2) {
        let finalizedForm = convertToFormData(convertedData);
        finalizedForm.append("carId", selectedRowId.toString());
        updateEntity("Car", finalizedForm);
        //restart();
      } else if (selectedKey === 3) {
        let finalizedForm = convertToFormData(convertedData);
        finalizedForm.append("reservationId", selectedRowId.toString());
        updateEntity("Reservation", finalizedForm);
        //restart();
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      isLoading = false;
    }
  }

  async function handleCreate() {
    let returnedObject;
    if (selectedKey === 1) {
      // const randomUserObject = {
      //   email: "example@example.com", // Use a static value or a function to generate a fake email
      //   name: "Demo User", // Use a static value or a function to generate a fake name
      //   comment: Math.random() > 0.5 ? "This is a random comment." : null,
      //   role: "CUSTOMER",
      //   passwordHash: "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3", // Use a static value or a function to generate a hash
      //   disabled: Math.random() > 0.5,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };

      //returnedObject = await createUser(randomUserObject);
      fetchUserData();
      restart();
    } else if (selectedKey === 2) {
      // const randomCarObject = {
      //   branchId: 1,
      //   make: "GenericMake",
      //   model: "GenericModel",
      //   year: Math.floor(Math.random() * (2023 - 1990 + 1)) + 1990,
      //   colour: "GREEN",
      //   seats: Math.floor(Math.random() * (8 - 2 + 1)) + 2,
      //   description: "This is a generic car description.",
      //   photoUrl: Math.random() > 0.5 ? "https://example.com/photo.jpg" : null,
      //   dailyPrice: parseFloat((Math.random() * (500 - 50) + 50).toFixed(2)),
      //   bookingDisabled: Math.random() > 0.5,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };
      //returnedObject = await createCar(randomCarObject);
      fetchVehicleData();
      restart();
    } else if (selectedKey === 3) {
      // const reservation = {
      //   car: {
      //     // Assuming a nested "Car" object structure with minimal properties
      //   },
      //   holder: {
      //     // Assuming a nested "User" object structure with minimal properties
      //   },
      //   replaces: {},
      //   replacedBy: {
      //     // Nested "Reservation", null or with an ID property
      //   },
      //   quotedPrice: Math.floor(Math.random() * 500 + 100), // Random price between 100 and 500
      //   cancelled: Math.random() < 0.5, // Randomly true or false
      //   checkInNotes: "Checked in without issues.", // Randomly null or a string
      //   checkInLicenseNumber: "A1234567", // Randomly null or a string
      //   checkInLicenseIssuingJurisdiction: "CA", // Randomly null or a string
      //   plannedDepartureAt: new Date(),
      //   plannedReturnAt: new Date(),
      //   pickedUpAt: new Date(),
      //   returnedAt: new Date(),
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };
      //returnedObject = await createReservation(reservation);
      fetchReservationData();
      restart();
    }

    console.log(returnedObject); // Log the modified copy to the console
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
            {#if isLoading}
              <h1 class="h1">Loading...</h1>
            {:else}
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
                  class="variant-filled btn float-right font-bold">
                  New Entry
                </button>
              </div>
            {/if}
          {/key}
        {:else}
          <h3 class="h3 text-center font-bold">
            Please select an option to fetch the table.
          </h3>
        {/if}
      </div>
      <div class="container">
        <div class="container flex flex-row justify-center space-x-2 font-bold">
          <div>
            <button
              type="button"
              class="variant-filled btn"
              on:click={() => {
                fetchUserData();
                restart();
                selectedKey = 1;
                isSelected = true;
                selectedRowId = -1;
              }}>Load all Users</button>
          </div>
          <div>
            <button
              type="button"
              on:click={() => {
                fetchVehicleData();
                restart();
                selectedKey = 2;
                isSelected = true;
                selectedRowId = -1;
              }}
              class="variant-filled btn">Load all Vehicles</button>
          </div>
          <div>
            <button
              type="button"
              on:click={() => {
                fetchReservationData();
                restart();
                selectedKey = 3;
                isSelected = true;
                selectedRowId = -1;
              }}
              class="variant-filled btn">Load all Reservations</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex justify-center text-center">
      <div class="container p-5 font-bold">
        {#if isSelected == false}
          <h1>
            You will be able to select an entry in the table, and modify any
            attributes as needed.
          </h1>
        {:else if fetchedData && selectedRowId !== -1}
          <div class="table-container">
            <form bind:this={formElement}>
              <table class="table table-hover">
                <thead>
                  <tr>
                    {#each Object.keys(selectedData) as key}
                      <th>{key}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {#each Object.entries(selectedData) as [key, value]}
                      <td>
                        <input
                          type="text"
                          name={key}
                          {value}
                          class="input variant-form-material" />
                      </td>
                    {/each}
                  </tr>
                </tbody>
              </table>
              <div class="container p-3">
                <button
                  on:click={handleSubmit}
                  type="button"
                  class="variant-filled btn">
                  Update Information
                </button>
              </div>
            </form>
          </div>
          <div class="flex">
            <div class="container p-3">
              <button
                type="button"
                on:click={handleCreate}
                class="variant-filled btn">
                Generate an Entry.
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
