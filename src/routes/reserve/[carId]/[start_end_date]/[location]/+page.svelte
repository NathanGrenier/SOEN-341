<script lang="ts">
  import type { Branch } from ".prisma/client";
  import type { Car } from ".prisma/client";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { ModalSettings } from "@skeletonlabs/skeleton";
  import { createReservation } from "$lib/controllers/reservationController.js";
  import type { Reservation } from "@prisma/client";
  import { onMount } from "svelte";
  import {
    getCarById,
    getReservationsForCar,
  } from "$lib/controllers/carController.js";
  import { getBranchById } from "$lib/controllers/branchController.js";

  export let data;
  let startDate: string = data.startDate;
  let endDate: string = data.endDate;
  let branch: Branch | null;
  let currentCar: Car | null;

  onMount(async () => {
    currentCar = await getCarById(+data.params.carId);

    if (!currentCar) {
      window.location.href = "/browse-vehicles";
    }

    branch = await getBranchById(+data.params.location);

    if (!branch) {
      window.location.href = "/browse-vehicles";
    }

    const existingReservations = await getReservationsForCar(
      +data.params.carId,
    );

    const conflictingReservation = existingReservations.find((reservation) => {
      const plannedDepartureAt = new Date(
        reservation.plannedDepartureAt,
      ).getTime();
      const plannedReturnAt = new Date(reservation.plannedReturnAt).getTime();
      const startDateTimestamp = new Date(startDate).getTime();
      const endDateTimestamp = new Date(endDate).getTime();

      const isConflict =
        (plannedDepartureAt <= endDateTimestamp &&
          plannedReturnAt >= startDateTimestamp) ||
        (plannedDepartureAt <= startDateTimestamp &&
          plannedReturnAt >= endDateTimestamp);

      return isConflict;
    });

    if (conflictingReservation) {
      window.location.href = "/browse-vehicles";
    }
  });

  let firstName = data.user?.name.split(" ")[0];
  let middleName =
    data.user?.name.split(" ").length === 3 ? data.user.name.split(" ")[1] : "";
  let lastName = data.user?.name.split(" ").slice(-1);

  let extraEquipment: string[] = [];
  let selectedBranchId: number = +data.params.location;
  let isOnline = false;

  const modalStore = getModalStore();

  function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const today = `${year}-${month}-${day}`;
    return today;
  }

  function handleCancel() {
    window.location.href = "/browse-vehicles";
  }

  function isStartDateBeforeEndDate(
    startDate: string | number,
    endDate: string | number,
  ) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    return startDateObj < endDateObj;
  }

  function formatDate(dateString: string | number) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function handleReserve() {
    if (!branch) return;

    const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;

    const userInfoModal: ModalSettings = {
      type: "confirm",
      title: "Reservation Information",
      body: `
      <div class="space-y-4">
        <div class="flex justify-between">
          <span>Name:</span>
          <span>${fullName}</span>
        </div>
        <div class="flex justify-between">
          <span>Start Date:</span>
          <span>${formatDate(startDate)}</span>
        </div>
        <div class="flex justify-between">
          <span>End Date:</span>
          <span>${formatDate(endDate)}</span>
        </div>
        <div class="flex justify-between">
          <span>Payment Method:</span>
          <span>${isOnline ? "Online" : "In-Person"}</span>
        </div>
        <div class="flex justify-between">
          <span>Extra Equipment:</span>
          <span>${extraEquipment.length !== 0 ? extraEquipment.join(", ") : "None"}</span>
        </div>
      </div>
    `,
      response: (confirmed: boolean) => {
        if (!confirmed) {
          return;
        }

        const branchDetailsModal: ModalSettings = {
          type: "confirm",
          title: "Branch Details",
          body: `
          <div class="space-y-4">
            <div class="flex justify-between">
              <span>Name:</span>
              <span>${branch?.name}</span>
            </div>
            <div class="flex justify-between">
              <span>Street Address:</span>
              <span>${branch?.streetAddress}</span>
            </div>
            <div class="flex justify-between">
              <span>City:</span>
              <span>${branch?.city}</span>
            </div>
            <div class="flex justify-between">
              <span>Region:</span>
              <span>${branch?.region}</span>
            </div>
            <div class="flex justify-between">
              <span>Country:</span>
              <span>${branch?.country}</span>
            </div>
            <div class="flex justify-between">
              <span>Postal Code:</span>
              <span>${branch?.postalCode}</span>
            </div>
          </div>
        `,
          response: (confirmed: boolean) => {
            if (!confirmed) {
              return;
            }

            // Third Modal: Car Details
            const carDetailsModal: ModalSettings = {
              type: "confirm",
              title: "Car Details",
              body: `
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span>Make:</span>
                  <span>${currentCar?.make}</span>
                </div>
                <div class="flex justify-between">
                  <span>Model:</span>
                  <span>${currentCar?.model}</span>
                </div>
                <div class="flex justify-between">
                  <span>Year:</span>
                  <span>${currentCar?.year}</span>
                </div>
                <div class="flex justify-between">
                  <span>Colour:</span>
                  <span>${currentCar?.colour}</span>
                </div>
                <div class="flex justify-between">
                  <span>Seats:</span>
                  <span>${currentCar?.seats}</span>
                </div>
                <div class="flex justify-between">
                  <span>Daily Price:</span>
                  <span>${currentCar ? currentCar.dailyPrice / 100 + ".00 $" : ""}</span>
                </div>
              </div>
            `,
              response: async (confirmed: boolean) => {
                if (!confirmed) {
                  return;
                }

                const loadingModal: ModalSettings = {
                  type: "alert",
                  title: "Loading",
                  body: `<div class="flex justify-center items-center" role="status">
                          <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                          <span class="sr-only">Loading...</span>
                        </div>
                        `,
                  response: (confirmed: boolean) => {
                    if (!confirmed) {
                      return;
                    }
                  },
                };
                modalStore.trigger(loadingModal);

                const timeDifference =
                  new Date(endDate).getTime() - new Date(startDate).getTime();
                const numberOfDays = Math.ceil(
                  timeDifference / (1000 * 3600 * 24),
                );
                const quotedPrice = currentCar?.dailyPrice
                  ? numberOfDays * currentCar?.dailyPrice
                  : 0;

                const reservationData: Omit<Reservation, "id"> = {
                  carId: currentCar?.id || 0,
                  holderId: data.user?.id || 0,
                  replacesId: null,
                  quotedPrice: quotedPrice || 0,
                  cancelled: false,
                  checkInNotes: null,
                  checkInLicenseNumber: null,
                  checkInLicenseIssuingJurisdiction: null,
                  plannedDepartureAt: new Date(startDate),
                  plannedReturnAt: new Date(endDate),
                  pickedUpAt: null,
                  returnedAt: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                };

                // Call createReservation function
                createReservation(reservationData)
                  .then(() => {
                    modalStore.close();
                    window.location.href = "/";
                  })
                  .catch((error) => {
                    console.error("Error creating reservation: " + error);
                  });
              },
            };
            modalStore.trigger(carDetailsModal);
          },
        };
        modalStore.trigger(branchDetailsModal);
      },
    };

    modalStore.trigger(userInfoModal);
  }

  function handlePaymentMethodChange(event: Event) {
    const target = event.target as HTMLInputElement;
    isOnline = target.value === "online";
  }

  function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const { value, checked } = target;
    if (checked) {
      extraEquipment = [...extraEquipment, value];
    } else {
      extraEquipment = extraEquipment.filter((item) => item !== value);
    }
  }
</script>

<div class="card p-2">
  <header class="card-header my-2 flex justify-center">
    <h1 class="h1">Reservation Form</h1>
  </header>

  <div class="bg-secondary my-2 grid grid-cols-4 gap-4 p-4">
    <div class="card col-span-3 p-4">
      <section class="space-y-4 p-4">
        <div>
          <h3 class="h3">Contact Information</h3>
        </div>

        <label class="label space-y-2">
          <span>First Name</span>
          <input class="input" bind:value={firstName} type="text" />
        </label>

        <div class="label space-y-2">
          <span>Middle Name (if applicable)</span>
          <input class="input" bind:value={middleName} type="text" />
        </div>

        <div class="label space-y-2">
          <span>Last Name</span>
          <input class="input" type="text" bind:value={lastName} />
        </div>
      </section>

      <section class="space-y-4 p-4">
        <div>
          <h3 class="h3">Expected Start and End Date</h3>
        </div>

        <div class="flex justify-center space-x-4">
          <div class="space-y-2">
            <span>Start Date</span>
            <input
              class="input"
              type="date"
              bind:value={startDate}
              min={getToday()} />
          </div>

          <div class="space-y-2">
            <span>End Date</span>
            <input
              class="input"
              type="date"
              bind:value={endDate}
              min={getToday()} />
          </div>
        </div>
      </section>

      <section class="space-y-4 p-4">
        <h3 class="h3">Extra Equipment</h3>

        <div class="flex justify-center space-x-4">
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="form-checkbox"
              value="gps"
              bind:group={extraEquipment}
              on:change={handleCheckboxChange} />
            <span>GPS</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="form-checkbox"
              value="child-seat"
              bind:group={extraEquipment}
              on:change={handleCheckboxChange} />
            <span>Child Seat</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="form-checkbox"
              value="roof-rack"
              bind:group={extraEquipment}
              on:change={handleCheckboxChange} />
            <span>Roof Rack</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="form-checkbox"
              value="bike-rack"
              bind:group={extraEquipment}
              on:change={handleCheckboxChange} />
            <span>Bike Rack</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="form-checkbox"
              value="snow-chains"
              bind:group={extraEquipment}
              on:change={handleCheckboxChange} />
            <span>Snow Chains</span>
          </label>
        </div>
      </section>

      <section class="space-y-4 p-4">
        <h3 class="h3">Payment Method</h3>

        <div class="flex justify-center space-x-4">
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              class="form-radio"
              value="in-person"
              name="paymentMethod"
              on:change={handlePaymentMethodChange}
              checked={!isOnline} />
            <span>In-Person</span>
          </label>

          <label class="flex items-center space-x-2">
            <input
              type="radio"
              class="form-radio"
              value="online"
              name="paymentMethod"
              on:change={handlePaymentMethodChange}
              checked={isOnline} />
            <span>Online</span>
          </label>
        </div>
      </section>

      <section class="space-y-4 overflow-hidden p-4">
        <div>
          <h3 class="h3">Branch Location</h3>

          <div class="rounded-d bg-slate-900 card mx-auto my-2 overflow-hidden">
            <div class="px-4 py-2">
              <div class="flex items-center">
                <span class="mr-2 text-base font-bold">Branch Name:</span>
                <span class="text-xl">{branch?.name}</span>
              </div>
            </div>
            <div class="px-4 py-2">
              <div class="flex items-center">
                <span class="mr-2 text-base font-bold">Description:</span>
                <span>{branch?.description}</span>
              </div>
            </div>
            <div class="px-4 py-2">
              <div class="flex items-center">
                <span class="mr-2 text-base font-bold">Address:</span>
                <span>
                  {branch?.streetAddress}, {branch?.city}, {branch?.region},
                  {branch?.country}, {branch?.postalCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="card col-span-1 p-4">
      <header class="mb-4 flex items-center justify-center">
        <h2 class="text-center text-lg font-semibold">Car Details</h2>
      </header>
      <div class="space-y-8">
        <div class="mb-2 flex justify-center">
          <img
            src={currentCar?.photoUrl}
            alt="Car"
            class="w-128 h-auto rounded-md" />
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Make:</span>
          <span>{currentCar?.make}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Model:</span>
          <span>{currentCar?.model}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Year:</span>
          <span>{currentCar?.year}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Colour:</span>
          <span>{currentCar?.colour}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Seats:</span>
          <span>{currentCar?.seats}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Daily Price:</span>
          <span>{currentCar ? currentCar.dailyPrice / 100 + ".00 $" : ""}</span>
        </div>
      </div>
    </div>
  </div>

  <footer class="card-footer my-2 flex justify-center space-x-4">
    <button type="button" class="variant-filled btn" on:click={handleCancel}>
      <span
        ><svg
          id="Cancel_24"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          ><rect
            width="24"
            height="24"
            stroke="none"
            fill="#000000"
            opacity="0" />

          <g transform="matrix(1 0 0 1 12 12)">
            <path
              style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
              transform=" translate(-12, -12)"
              d="M 12 2 C 6.47 2 2 6.47 2 12 C 2 17.53 6.47 22 12 22 C 17.53 22 22 17.53 22 12 C 22 6.469999999999999 17.53 2 12 2 z M 17 15.59 L 15.59 17 L 12 13.41 L 8.41 17 L 7 15.59 L 10.59 12 L 7 8.41 L 8.41 7 L 12 10.59 L 15.59 7 L 17 8.41 L 13.41 12 L 17 15.59 z"
              stroke-linecap="round" />
          </g>
        </svg></span>
      <span>Cancel</span>
    </button>
    <button
      type="button"
      class="variant-filled btn"
      on:click={handleReserve}
      disabled={!firstName ||
        !lastName ||
        !isStartDateBeforeEndDate(startDate, endDate) ||
        startDate < getToday() ||
        endDate < getToday() ||
        selectedBranchId === -1 ||
        !currentCar}>
      <span
        ><svg
          class="text-black dark:text-white h-[28px] w-[28px]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <path
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h0" />
        </svg>
      </span>
      <span>Reserve</span>
    </button>
  </footer>
</div>
