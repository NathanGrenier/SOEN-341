<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { ModalSettings, ToastSettings } from "@skeletonlabs/skeleton";
  import type { Reservation } from "@prisma/client";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import { parseDate } from "$lib/utils.js";
  import Reserve from "$lib/icons/Reserve.svelte";
  import CancelIcon from "$lib/icons/CancelIcon.svelte";
  import { tweened } from "svelte/motion";
  import { quadInOut } from "svelte/easing";

  export let data;

  const toastStore = getToastStore();
  const { startDate } = data;
  const { endDate } = data;
  const { currentCar } = data;
  const { currentBranch } = data;
  const { allAccessories } = data;
  const { allCoupons } = data;

  let creditCardNumber: string;
  let cvvNumber: string;
  let expiryDate: string;
  let couponAlreadyApplied = false;

  const totalPrice = tweened(0, {
    easing: quadInOut,
    duration: 500,
  });
  let prevPrice = $totalPrice;

  const timeDifference =
    new Date(endDate).getTime() - new Date(startDate).getTime();

  const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  totalPrice.set((numberOfDays * currentCar.dailyPrice) / 100);

  let currentCouponId: string;
  let firstName = data.user?.name.split(" ")[0];
  let middleName =
    data.user?.name.split(" ").length === 3 ? data.user.name.split(" ")[1] : "";
  let lastName = data.user?.name.split(" ").slice(-1);

  let extraEquipment: number[] = [];

  const modalStore = getModalStore();

  function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const today = `${year}-${month}-${day} ${hour}:${minute}`;
    return today;
  }

  function handleCancel() {
    window.location.href = "/browse-vehicles";
  }

  function formatDatetoHuman(date: Date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  function isStartDateBeforeEndDate(
    startDate: string | number,
    endDate: string | number,
  ) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    return startDateObj < endDateObj;
  }

  function handleReserve() {
    if (!currentBranch) return;

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
          <span>${formatDatetoHuman(new Date(startDate))}</span>
        </div>
        <div class="flex justify-between">
          <span>End Date:</span>
          <span>${formatDatetoHuman(new Date(endDate))}</span>
        </div>
        <div class="flex justify-between">
          <span>Payment Method:</span>
          <span>${creditCardNumber} : ${cvvNumber} : ${expiryDate}</span>
        </div>
        <div class="flex justify-between">
          <span>Extra Equipment:</span>
          <span>${
            extraEquipment.length !== 0
              ? allAccessories
                  .filter((accessory) => extraEquipment.includes(accessory.id))
                  .map((accessory) => accessory.name)
                  .join(", ")
              : "None"
          }
          </span>
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
              <span>${currentBranch.name}</span>
            </div>
            <div class="flex justify-between">
              <span>Street Address:</span>
              <span>${currentBranch.streetAddress}</span>
            </div>
            <div class="flex justify-between">
              <span>City:</span>
              <span>${currentBranch.city}</span>
            </div>
            <div class="flex justify-between">
              <span>Region:</span>
              <span>${currentBranch.region}</span>
            </div>
            <div class="flex justify-between">
              <span>Country:</span>
              <span>${currentBranch.country}</span>
            </div>
            <div class="flex justify-between">
              <span>Postal Code:</span>
              <span>${currentBranch.postalCode}</span>
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
                  <span>${currentCar.make}</span>
                </div>
                <div class="flex justify-between">
                  <span>Model:</span>
                  <span>${currentCar.model}</span>
                </div>
                <div class="flex justify-between">
                  <span>Year:</span>
                  <span>${currentCar.year}</span>
                </div>
                <div class="flex justify-between">
                  <span>Colour:</span>
                  <span>${currentCar.colour}</span>
                </div>
                <div class="flex justify-between">
                  <span>Seats:</span>
                  <span>${currentCar.seats}</span>
                </div>
                <div class="flex justify-between">
                  <span>Daily Price:</span>
                  <span>${currentCar ? currentCar.dailyPrice / 100 + ".00 $" : ""}</span>
                </div>
                <div class="flex justify-between">
                  <span>Total Price:</span>
                  <span>${$totalPrice}</span>
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

                const quotedPrice = $totalPrice;

                function convertDateToSpecificTimezone(
                  userDate: Date,
                  targetTimezone: string,
                ): Date {
                  const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: targetTimezone,
                  });
                  const targetDateString = formatter.format(userDate);

                  const targetDate = new Date(targetDateString);

                  return targetDate;
                }

                const reservationData: Partial<Reservation> = {
                  carId: currentCar.id ?? 0,
                  holderId: data.user?.id ?? 0,
                  replacesId: null,
                  quotedPrice: quotedPrice ?? 0,
                  cancelled: false,
                  checkInLicenseNumber: null,
                  checkInLicenseIssuingJurisdiction: null,
                  plannedDepartureAt: convertDateToSpecificTimezone(
                    parseDate(startDate),
                    currentBranch.timezone,
                  ),
                  plannedReturnAt: convertDateToSpecificTimezone(
                    parseDate(endDate),
                    currentBranch.timezone,
                  ),
                  pickedUpAt: null,
                  returnedAt: null,
                  createdAt: convertDateToSpecificTimezone(
                    new Date(),
                    currentBranch.timezone,
                  ),
                  updatedAt: convertDateToSpecificTimezone(
                    new Date(),
                    currentBranch.timezone,
                  ),
                  creditCardCVV: cvvNumber,
                  creditCardNumber: creditCardNumber,
                  creditCardExpiry: expiryDate,
                };

                const formData = new FormData();

                Object.entries(reservationData).forEach(([key, value]) => {
                  formData.append(key, value?.toString() ?? "");
                });

                fetch("", {
                  method: "POST",
                  body: formData,
                })
                  .then((res: Response) => {
                    if (res.ok) {
                      return res.json();
                    } else {
                      const cancelErrorToast: ToastSettings = {
                        message: "There was an error filtering cars.",
                        background: "variant-filled-error",
                        autohide: true,
                      };

                      toastStore.trigger(cancelErrorToast);
                    }
                  })
                  .then((data) => {
                    const dataArray = JSON.parse(data.data);
                    const id = dataArray[1];
                    window.location.href = `/dashboard/reservation-${id}`;
                  })
                  .catch(() => {
                    const failToast: ToastSettings = {
                      message: "There was an error creating the reservation",
                      background: "variant-filled-error",
                      autohide: true,
                    };
                    toastStore.trigger(failToast);
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

  function handleCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const { value, checked } = target;
    if (checked) {
      extraEquipment = [...extraEquipment, Number(value)];
    } else {
      extraEquipment = extraEquipment.filter((item) => item !== Number(value));
    }
  }

  function isValidCreditCard(
    creditCardNumber: string,
    cvvNumber: string,
    expiryDate: string,
  ) {
    const creditCardRegex =
      /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

    const cvvRegex = /^[0-9]{3,4}$/;

    const expiryDateRegex = /^(0[1-9]|1[0-2])\/(20[2-9][0-9])$/;

    return (
      creditCardRegex.test(creditCardNumber) &&
      cvvRegex.test(cvvNumber) &&
      expiryDateRegex.test(expiryDate)
    );
  }

  function verifyCoupon(couponToCheck: string) {
    for (const coupon of allCoupons) {
      if (coupon.couponCode === couponToCheck) {
        const successfulCoupon: ToastSettings = {
          message: `Coupon code ${couponToCheck} successfully applied.`,
          background: "variant-filled-success",
          autohide: true,
        };
        let discount = 0;
        let previousPrice = $totalPrice;
        if (coupon.discountBasisPoints != null) {
          const basisPointsDiscount =
            (previousPrice * coupon.discountBasisPoints) / 10000;
          discount = Math.min(basisPointsDiscount, previousPrice);
        } else if (coupon.discountAmount != null) {
          discount = Math.min(coupon.discountAmount, previousPrice);
        }
        prevPrice = $totalPrice;
        totalPrice
          .update(() => {
            return previousPrice - discount;
          })
          .then(() => {
            couponAlreadyApplied = true;
          });
        toastStore.trigger(successfulCoupon);
        return true;
      }
    }
    const failedCoupon: ToastSettings = {
      message: "This coupon code does not exist.",
      background: "variant-filled-error",
      autohide: true,
    };

    toastStore.trigger(failedCoupon);
    return false;
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
              type="text"
              value={`${formatDatetoHuman(new Date(startDate))}`}
              readonly />
          </div>

          <div class="space-y-2">
            <span>End Date</span>
            <input
              class="input"
              type="text"
              value={`${formatDatetoHuman(new Date(endDate))}`}
              readonly />
          </div>
        </div>
      </section>

      <section class="space-y-4 p-4">
        <h3 class="h3">Extra Equipment</h3>

        <div class="flex justify-center space-x-4">
          {#each allAccessories as accessory}
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                class="form-checkbox"
                value={accessory.id}
                bind:group={extraEquipment}
                on:change={handleCheckboxChange} />
              <span>{accessory.name}</span>
            </label>
          {/each}
        </div>
      </section>

      <section class="space-y-4 p-4">
        <h3 class="h3">Redeem a Coupon</h3>

        <div class="flex justify-center space-x-4">
          <label class="flex items-center">
            <input
              type="input"
              class="input p-2"
              bind:value={currentCouponId} />
          </label>
          <button
            disabled={!currentCouponId || couponAlreadyApplied}
            class="variant-filled btn"
            on:click={() => {
              if (!verifyCoupon(currentCouponId)) currentCouponId = "";
            }}>Redeem</button>
          <button
            disabled={!currentCouponId || !couponAlreadyApplied}
            class="variant-filled btn"
            on:click={() => {
              console.log(prevPrice);
              totalPrice
                .update(() => {
                  return prevPrice;
                })
                .then(() => {
                  couponAlreadyApplied = false;
                });
            }}>Remove</button>
        </div>
      </section>

      <section class="space-y-4 p-4">
        <h3 class="h3">Payment Method</h3>

        <div class="flex justify-center space-x-4">
          <label>
            Credit Card Number <input
              type="text"
              class="input"
              bind:value={creditCardNumber}
              name="creditCardNumber" /></label>

          <label
            >Expiry Date <input
              type="text"
              class="input"
              bind:value={expiryDate}
              name="expiryDate" /></label>

          <label
            >CVV <input
              type="text"
              class="input"
              bind:value={cvvNumber}
              name="cvvNumber" /></label>
        </div>
      </section>

      <section class="space-y-4 overflow-hidden p-4">
        <div>
          <h3 class="h3">Branch Location</h3>

          <div class="card mx-auto my-2 overflow-hidden">
            <div class="px-4 py-2">
              <div class="flex items-center">
                <span class="mr-2 text-base font-bold">Branch Name:</span>
                <span class="text-xl">{currentBranch.name}</span>
              </div>
            </div>
            <div class="px-4 py-2">
              <div class="flex items-center">
                <span class="mr-2 text-base font-bold">Description:</span>
                <span>{currentBranch.description}</span>
              </div>
            </div>
            <div class="px-4 py-2">
              <div class="flex items-center">
                <span class="mr-2 text-base font-bold">Address:</span>
                <span>
                  {currentBranch.streetAddress}, {currentBranch.city}, {currentBranch.region},
                  {currentBranch.country}, {currentBranch.postalCode}
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
            src={currentCar.photoUrl}
            alt="Car"
            class="w-128 h-auto rounded-md" />
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Make:</span>
          <span>{currentCar.make}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Model:</span>
          <span>{currentCar.model}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Year:</span>
          <span>{currentCar.year}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Colour:</span>
          <span>{currentCar.colour}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Seats:</span>
          <span>{currentCar.seats}</span>
        </div>
        <div class="mb-2 flex justify-between">
          <span class="font-semibold">Daily Price:</span>
          <span>{currentCar ? currentCar.dailyPrice / 100 + ".00 $" : ""}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Total Price:</span>
          <span>{$totalPrice.toFixed(2)} $</span>
        </div>
        {#if couponAlreadyApplied}
          <div class="flex justify-between">
            <span>Coupon Applied:</span>
            <span>{currentCouponId}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <footer class="card-footer my-2 flex justify-center space-x-4">
    <button type="button" class="variant-filled btn" on:click={handleCancel}>
      <span><CancelIcon /></span>
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
        !currentCar ||
        !isValidCreditCard(creditCardNumber, cvvNumber, expiryDate)}>
      <span><Reserve /> </span>
      <span>Reserve</span>
    </button>
  </footer>
</div>
