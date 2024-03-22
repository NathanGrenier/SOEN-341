<script lang="ts">
  import type { Car, Reservation, User } from "@prisma/client";
  import Datatable from "./Datatable.svelte";

  export let data;

  let { users } = data;
  let { reservations } = data;
  let { cars } = data;

  let fetchedData: Car[] | Reservation[] | User[];
  let isLoading = false;

  $: selectedKey = -1;
  $: isSelected = false;

  let selectedRowId: number = -1;
  let selectedData: ArrayLike<unknown> | { [s: string]: unknown };
  function handleRowClick(event: { detail: number }) {
    selectedRowId = event.detail;
    selectedData = fetchedData.find(
      (item: { id: number }) => item.id === selectedRowId,
    );
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

    const convertValue = (value: string) => {
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
      Object.entries(data).map(([key, value]) => [
        key,
        convertValue(value.toString()),
      ]),
    );

    isLoading = true;
    try {
      if (selectedKey === 1) {
        convertedData = { ...convertedData, id: selectedRowId };

        fetch("?/updateUser", {
          method: "POST",
          body: JSON.stringify(convertedData),
        })
          .then((res) => {
            if (res.ok) {
              console.log("Succesfully updated user");
            }
          })
          .catch((err) => {
            console.error("There was an error updating user: " + err);
          });

        restart();
      } else if (selectedKey === 2) {
        convertedData = { ...convertedData, id: selectedRowId };

        fetch("?/updateCar", {
          method: "POST",
          body: JSON.stringify(convertedData),
        })
          .then((res) => {
            if (res.ok) {
              console.log("Succesfully updated car");
            }
          })
          .catch((err) => {
            console.error("There was an error updating user: " + err);
          });

        restart();
      } else if (selectedKey === 3) {
        convertedData = { ...convertedData, id: selectedRowId };

        fetch("?/updateReservation", {
          method: "POST",
          body: JSON.stringify(convertedData),
        })
          .then((res) => {
            if (res.ok) {
              console.log("Succesfully updated reservation");
            }
          })
          .catch((err) => {
            console.error("There was an error updating user: " + err);
          });

        restart();
      }
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      isLoading = false;
    }
  }

  async function handleCreate() {
    // let dataCopy = { ...selectedData };

    // delete (dataCopy as { [x: string]: unknown }).id;

    // const convertValue = (value) => {
    //   // Check if the value is an empty string and return it as is
    //   if (value === "") return value;

    //   // Attempt to convert to a Number
    //   const numberValue = Number(value);
    //   if (!isNaN(numberValue) && value !== "") return numberValue; // Return the number if it's a valid conversion

    //   // Attempt to convert to a Boolean
    //   if (value.toLowerCase() === "true") return true;
    //   if (value.toLowerCase() === "false") return false;

    //   // Default to string if no other conversions apply
    //   return value;
    // };

    // const convertedData = Object.fromEntries(
    //   Object.entries(dataCopy).map(([key, value]) => [key, convertValue(value)]),
    // );
    if (selectedKey === 1) {
      const randomObject = {
        email: "example@example.com", // Use a static value or a function to generate a fake email
        name: "Demo User", // Use a static value or a function to generate a fake name
        comment: Math.random() > 0.5 ? "This is a random comment." : null,
        role: "CUSTOMER",
        passwordHash: "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3", // Use a static value or a function to generate a hash
        disabled: Math.random() > 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      fetch("?/createUser", {
        method: "POST",
        body: JSON.stringify(randomObject),
      })
        .then((res) => {
          if (res.ok) {
            console.log("Succesfully created user");
          }
        })
        .catch((err) => {
          console.error("There was an error creating user: " + err);
        });

      restart();

      location.reload();
    } else if (selectedKey === 2) {
      const randomCarObject = {
        branchId: 1,
        make: "GenericMake",
        model: "GenericModel",
        year: Math.floor(Math.random() * (2023 - 1990 + 1)) + 1990,
        colour: "GREEN",
        seats: Math.floor(Math.random() * (8 - 2 + 1)) + 2,
        description: "This is a generic car description.",
        photoUrl: Math.random() > 0.5 ? "https://example.com/photo.jpg" : null,
        dailyPrice: parseFloat((Math.random() * (500 - 50) + 50).toFixed(2)),
        bookingDisabled: Math.random() > 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      fetch("?/createCar", {
        method: "POST",
        body: JSON.stringify(randomCarObject),
      })
        .then((res) => {
          if (res.ok) {
            console.log("Succesfully created car");
          }
        })
        .catch((err) => {
          console.error("There was an error creating car: " + err);
        });

      restart();

      location.reload();
    } else if (selectedKey === 3) {
      const reservation = {
        car: {
          // Assuming a nested "Car" object structure with minimal properties
        },
        holder: {
          // Assuming a nested "User" object structure with minimal properties
        },
        replaces: {},
        replacedBy: {
          // Nested "Reservation", null or with an ID property
        },
        quotedPrice: Math.floor(Math.random() * 500 + 100), // Random price between 100 and 500
        cancelled: Math.random() < 0.5, // Randomly true or false
        checkInNotes: "Checked in without issues.", // Randomly null or a string
        checkInLicenseNumber: "A1234567", // Randomly null or a string
        checkInLicenseIssuingJurisdiction: "CA", // Randomly null or a string
        plannedDepartureAt: new Date(),
        plannedReturnAt: new Date(),
        pickedUpAt: new Date(),
        returnedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      fetch("?/createReservation", {
        method: "POST",
        body: JSON.stringify(reservation),
      })
        .then((res) => {
          if (res.ok) {
            console.log("Succesfully created reservation");
          }
        })
        .catch((err) => {
          console.error("There was an error creating reservation: " + err);
        });

      restart();

      location.reload();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // function convertToType(
  //   selectedKey: number,
  //   data: { [key: string]: string },
  // ): User | Car | Reservation {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   let convertedData: any = {};
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   let targetType: any;
  //   switch (selectedKey) {
  //     case 1:
  //       targetType: User;
  //       break;
  //     case 2:
  //       targetType: Car;
  //       break;
  //     case 3:
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       targetType: Reservation;
  //       break;
  //     default:
  //       throw new Error("Invalid selectedKey");
  //   }

  //   for (let key in targetType) {
  //     let value = data[key];

  //     // Convert string to boolean if value is 'true' or 'false'
  //     if (value === "true" || value === "false") {
  //       convertedData[key] = value === "true";
  //     }
  //     // Convert string to number if value is numeric
  //     else if (!isNaN(Number(value))) {
  //       convertedData[key] = Number(value);
  //     }
  //     // Convert string to enum if value is a valid enum value
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     else if (UserRole[value] || CarColour[value]) {
  //       convertedData[key] = value;
  //     }
  //     // Leave string as is
  //     else if (value) {
  //       convertedData[key] = value;
  //     }
  //     // If property is missing, add it with a random value of the correct type
  //     else {
  //       if (targetType[key] === "boolean") {
  //         convertedData[key] = Math.random() >= 0.5;
  //       } else if (targetType[key] === "number") {
  //         convertedData[key] = Math.floor(Math.random() * 100);
  //       } else if (targetType[key] === "string") {
  //         convertedData[key] = Math.random().toString(36).substring(7);
  //       } else if (targetType[key] === "UserRole") {
  //         convertedData[key] =
  //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //           Object.values(UserRole)[
  //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //             Math.floor(Math.random() * Object.values(UserRole).length)
  //           ];
  //       } else if (targetType[key] === "CarColour") {
  //         convertedData[key] =
  //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //           Object.values(CarColour)[
  //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //             Math.floor(Math.random() * Object.values(CarColour).length)
  //           ];
  //       }
  //     }
  //   }

  //   return convertedData;
  // }
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
              <Datatable
                fetchCase={selectedKey}
                on:rowClick={handleRowClick}
                userData={fetchedData} />
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
                fetchedData = users;
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
                fetchedData = cars;
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
                fetchedData = reservations;
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
