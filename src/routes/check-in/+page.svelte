<script lang="ts">
  import { Step, Stepper } from "@skeletonlabs/skeleton";
  import type { PageData } from "../$types";
  import { licenseNumberFormats } from "$lib/licenses";
  export let data: PageData;
  let checkInForm: HTMLFormElement;
  let confirmName: boolean;
  let confirmPhoto: boolean;
  let confirmExpiry: boolean;
  let licenseNumber: string;
  let licenseNumberInvalid: boolean = false;
  let licenseIssuingJurisdiction: string;
  let confirmDeposit: boolean;
  let damageReport: string;
  let idVerificationLocked: boolean = true;
  let paymentVerificationLocked: boolean = true;

  const validateCheckIn = () => {
    if (
      !confirmName ||
      !confirmPhoto ||
      !confirmExpiry ||
      !licenseNumber ||
      !licenseIssuingJurisdiction
    ) {
      idVerificationLocked = true;
    } else {
      // Validate the license number
      if (licenseNumberFormats[licenseIssuingJurisdiction]) {
        let matches = licenseNumber
          .trim()
          .toUpperCase()
          .match(licenseNumberFormats[licenseIssuingJurisdiction].regex);
        if (!matches) {
          licenseNumberInvalid = true;
          idVerificationLocked = true;
        } else {
          licenseNumber = matches.slice(1).join("-");
          licenseNumberInvalid = false;
          idVerificationLocked = false;
        }
      } else {
        licenseNumberInvalid = false;
        idVerificationLocked = false;
      }
    }
    if (!confirmDeposit) {
      paymentVerificationLocked = true;
    } else {
      paymentVerificationLocked = false;
    }
  };
</script>

<h1 class="text-center text-4xl font-bold">Check-in</h1>

<form bind:this={checkInForm} on:change={validateCheckIn} method="POST">
  <!-- These values need to exist outside the stepper and be bound to values inside the stepper, otherwise, they will
  not be present when the form is submitted because the earlier steps will no longer be present in the DOM. See issue
  https://github.com/skeletonlabs/skeleton/discussions/1490 in the Skeleton project. -->
  <input type="hidden" name="reservationId" value={data.reservation.id} />
  <input type="hidden" name="confirmName" value={confirmName} />
  <input type="hidden" name="confirmPhoto" value={confirmPhoto} />
  <input type="hidden" name="confirmExpiry" value={confirmExpiry} />
  <input
    type="hidden"
    name="licenseIssuingJurisdiction"
    value={licenseIssuingJurisdiction} />
  <input type="hidden" name="licenseNumber" value={licenseNumber} />
  <input type="hidden" name="confirmDeposit" value={confirmDeposit} />
  <input type="hidden" name="damageReport" value={damageReport} />
  <Stepper on:complete={() => checkInForm.submit()}>
    <Step locked={idVerificationLocked}>
      <svelte:fragment slot="header">Identity Verification</svelte:fragment>
      <p>Ask the customer for their driver's licence.</p>

      <label class="flex items-center space-x-2">
        <input class="checkbox" type="checkbox" bind:checked={confirmName} />
        <p>
          Confirm the name on the driver's licence: <b
            >{data.reservation.holder.name}</b>
        </p>
      </label>
      <label class="flex items-center space-x-2">
        <input class="checkbox" type="checkbox" bind:checked={confirmPhoto} />
        <p>
          Check that the <b>photo</b> on the licence resembles the individual presenting
          it
        </p>
      </label>
      <label class="flex items-center space-x-2">
        <input class="checkbox" type="checkbox" bind:checked={confirmExpiry} />
        <p>
          Check that the licence <b
            >will not expire before {data.reservation.plannedReturnAt.toLocaleString()}</b>
        </p>
      </label>
      <label class="label">
        <span>Licence issuing jurisdiction:</span>
        <select class="select" bind:value={licenseIssuingJurisdiction}>
          <option value="">Select...</option>
          <option value="CA-AB">Canada: Alberta</option>
          <option value="CA-BC">Canada: British Columbia</option>
          <option value="CA-MB">Canada: Manitoba</option>
          <option value="CA-NB">Canada: New Brunswick</option>
          <option value="CA-NL">Canada: Newfoundland and Labrador</option>
          <option value="CA-NT">Canada: Northwest Territories</option>
          <option value="CA-NS">Canada: Nova Scotia</option>
          <option value="CA-NU">Canada: Nunavut</option>
          <option value="CA-ON">Canada: Ontario</option>
          <option value="CA-QC">Canada: Québec</option>
          <option value="CA-PE">Canada: Prince Edward Island</option>
          <option value="CA-SK">Canada: Saskatchewan</option>
          <option value="CA-YT">Canada: Yukon Territory</option>
          <option value="CA-DN">Canada: National Defence</option>
          <option value="US-AK">United States: Alaska</option>
          <option value="US-AL">United States: Alabama</option>
          <option value="US-AS">United States: American Samoa</option>
          <option value="US-AZ">United States: Arizona</option>
          <option value="US-AR">United States: Arkansas</option>
          <option value="US-CA">United States: California</option>
          <option value="US-CO">United States: Colorado</option>
          <option value="US-CT">United States: Connecticut</option>
          <option value="US-DC">United States: District Of Columbia</option>
          <option value="US-DE">United States: Delaware</option>
          <option value="US-FL">United States: Florida</option>
          <option value="US-GA">United States: Georgia</option>
          <option value="US-GU">United States: Guam</option>
          <option value="US-HI">United States: Hawaii</option>
          <option value="US-ID">United States: Idaho</option>
          <option value="US-IL">United States: Illinois</option>
          <option value="US-IN">United States: Indiana</option>
          <option value="US-IA">United States: Iowa</option>
          <option value="US-KS">United States: Kansas</option>
          <option value="US-KY">United States: Kentucky</option>
          <option value="US-LA">United States: Louisiana</option>
          <option value="US-ME">United States: Maine</option>
          <option value="US-MD">United States: Maryland</option>
          <option value="US-MA">United States: Massachusetts</option>
          <option value="US-MI">United States: Michigan</option>
          <option value="US-MN">United States: Minnesota</option>
          <option value="US-MS">United States: Mississippi</option>
          <option value="US-MO">United States: Missouri</option>
          <option value="US-MT">United States: Montana</option>
          <option value="US-NE">United States: Nebraska</option>
          <option value="US-NV">United States: Nevada</option>
          <option value="US-NH">United States: New Hampshire</option>
          <option value="US-NJ">United States: New Jersey</option>
          <option value="US-NM">United States: New Mexico</option>
          <option value="US-NY">United States: New York</option>
          <option value="US-NC">United States: North Carolina</option>
          <option value="US-ND">United States: North Dakota</option>
          <option value="US-MP">United States: Northern Mariana Islands</option>
          <option value="US-OH">United States: Ohio</option>
          <option value="US-OK">United States: Oklahoma</option>
          <option value="US-OR">United States: Oregon</option>
          <option value="US-PA">United States: Pennsylvania</option>
          <option value="US-PR">United States: Puerto Rico</option>
          <option value="US-RI">United States: Rhode Island</option>
          <option value="US-SC">United States: South Carolina</option>
          <option value="US-SD">United States: South Dakota</option>
          <option value="US-TN">United States: Tennessee</option>
          <option value="US-TX">United States: Texas</option>
          <option value="US-UT">United States: Utah</option>
          <option value="US-VT">United States: Vermont</option>
          <option value="US-VA">United States: Virginia</option>
          <option value="US-VI">United States: Virgin Islands</option>
          <option value="US-WA">United States: Washington</option>
          <option value="US-WV">United States: West Virginia</option>
          <option value="US-WI">United States: Wisconsin</option>
          <option value="US-WY">United States: Wyoming</option>
          <option value="XX">Another country</option>
        </select>
      </label>
      <label class="label">
        <span>Licence number:</span>
        <input
          type="text"
          autocomplete="off"
          class="input"
          class:input-error={licenseNumberInvalid}
          bind:value={licenseNumber}
          placeholder={licenseNumberFormats[licenseIssuingJurisdiction]
            ? licenseNumberFormats[licenseIssuingJurisdiction].placeholder
            : ""} />
      </label>
      <small
        >{licenseNumberFormats[licenseIssuingJurisdiction]
          ? licenseNumberFormats[licenseIssuingJurisdiction].hint
          : ""}</small>
    </Step>
    <Step locked={paymentVerificationLocked}>
      <svelte:fragment slot="header">Payment Verification</svelte:fragment>
      <p>
        Ask the customer to present the payment card ending in <b
          >{data.reservation.creditCardNumber}</b
        >.
      </p>
      <p>
        Ask for consent to charge the $500 deposit. The customer can choose to
        pay in cash when they return the car.
      </p>
      <label class="flex items-center space-x-2">
        <input
          class="checkbox"
          type="checkbox"
          name="confirmDeposit"
          bind:checked={confirmDeposit} />
        <p>Customer consented to the $500 deposit</p>
      </label>
    </Step>
    <Step>
      <svelte:fragment slot="header">Damage Inspection</svelte:fragment>
      <p>
        Ask the customer to inspect the <b
          >{data.reservation.car.year}
          {data.reservation.car.colourStr}
          {data.reservation.car.make}
          {data.reservation.car.model}</b
        >.
      </p>
      <label class="label">
        <span>Record any damage noted by yourself or the customer:</span>
        <textarea
          class="textarea"
          rows="6"
          name="damageReport"
          bind:value={damageReport}></textarea>
      </label>
    </Step>
    <Step>
      <svelte:fragment slot="header">Customer Agreement Review</svelte:fragment>
      <p>
        Press <b>Next</b>, then turn the device to the customer to accept the
        rental contract.
      </p>
    </Step>
    <Step>
      <svelte:fragment slot="header">Rental Agreement</svelte:fragment>
      <p>Please carefully review the Rental Agreement, then press Next.</p>
      {#if damageReport}
        <p>
          The following damages have been noted, and you will not be held liable
          for them: <b>{damageReport}</b>.
        </p>
      {:else}
        <p>You have confirmed the car is in undamaged condition.</p>
      {/if}
      <h3 class="h3 text-center">Car Rental Agreement</h3>
      <p>Rental agreement number: {data.reservation.id}</p>
      <p>
        This Rental Agreement ("Agreement") is entered into between
        DriveXperience, located at 1455 boul. de Maisonneuve Ouest, Montréal, QC
        H3G 1M8, hereinafter referred to as the "Rental Company," and the
        individual or entity identified below, hereinafter referred to as the
        "Renter":
      </p>
      <h4 class="h4">1. Renter's Information</h4>
      <p>Name: {data.reservation.holder.name}</p>
      <p>Email address: {data.reservation.holder.email}</p>
      <p>
        Driver's licence number: {licenseNumber} ({licenseIssuingJurisdiction.slice(
          -2,
        )})
      </p>
      <h4 class="h4">2. Vehicle Information</h4>
      <p>Make: {data.reservation.car.make}</p>
      <p>Model: {data.reservation.car.model}</p>
      <p>Year: {data.reservation.car.year}</p>
      <p>Colour: {data.reservation.car.colourStr}</p>
      <p>Inventory number: {data.reservation.car.id}</p>
      <h4 class="h4">3. Rental Details</h4>
      <p>Rental start date: {data.reservation.plannedDepartureAt}</p>
      <p>Rental end date: {data.reservation.plannedReturnAt}</p>
      <p>Pick-up location: {data.reservation.car.branch.name}</p>
      <p>Drop-off location: {data.reservation.car.branch.name}</p>
      <p>Additonal services:</p>
      <ul class="list-inside list-disc">
        {#if data.reservation.accessories}
          {#each data.reservation.accessories as acc}
            <li>{acc.name}</li>
          {/each}
        {:else}
          <li>There are no included accessories.</li>
        {/if}
      </ul>
      <p>Total price: ${(data.reservation.quotedPrice / 100).toFixed(2)}</p>
      <p>No mileage limit applies to this reservation.</p>
      <h4 class="h4">4. Rental Terms and Conditions</h4>
      <p>
        The Renter acknowledges receiving the vehicle described above in good
        condition and agrees to return it to the Rental Company in the same
        condition, subject to normal wear and tear.
      </p>
      <p>
        The Renter agrees to use the vehicle solely for personal or business
        purposes and not for any illegal activities.
      </p>
      <p>
        The Renter agrees to pay the Rental Company the agreed-upon rental rate
        for the specified rental period. Additional charges may apply for
        exceeding the mileage limit, late returns, fuel refueling, or other
        damages.
      </p>
      <p>
        The Renter agrees to bear all costs associated with traffic violations,
        tolls, and parking fines incurred during the rental period.
      </p>
      <p>
        The Renter acknowledges that they are responsible for any loss or damage
        to the vehicle, including theft, vandalism, accidents, or negligence,
        and agrees to reimburse the Rental Company for all repair or replacement
        costs.
      </p>
      <p>
        The Renter agrees to return the vehicle to the designated drop-off
        location at the agreed-upon date and time. Failure to do so may result
        in additional charges.
      </p>
      <p>
        The Rental Company reserves the right to terminate this agreement and
        repossess the vehicle without prior notice if the Renter breaches any
        terms or conditions of this agreement.
      </p>
      <p>
        The Renter acknowledges receiving and reviewing a copy of the vehicle's
        insurance coverage and agrees to comply with all insurance requirements
        during the rental period.
      </p>
      <h4 class="h4">5. Indemnification</h4>
      <p>
        The Renter agrees to indemnify and hold harmless the Rental Company, its
        employees, agents, and affiliates from any claims, liabilities, damages,
        or expenses arising out of or related to the Renter's use of the
        vehicle.
      </p>
      <h4 class="h4">6. Jurisdiction</h4>
      <p>
        This Agreement shall be governed by and construed in accordance with the
        laws of Québec. Any disputes arising under or related to this Agreement
        shall be resolved exclusively by the courts of Québec.
      </p>
      <h4 class="h4">7. Entire Agreement</h4>
      <p>
        This Agreement constitutes the entire understanding between the parties
        concerning the subject matter hereof and supersedes all prior agreements
        and understandings, whether written or oral.
      </p>
      <h4 class="h4">8. Signatures</h4>
      <p>
        The parties hereto have executed this Agreement as of the date first
        written above.
      </p>
      <p>
        Your acceptance of this agreement will be recorded when you click <b
          >Next</b
        >, which is equivalent to your handwritten signature.
      </p>
    </Step>
    <Step>
      <svelte:fragment slot="header">Return Device</svelte:fragment>
      <p>
        Please return the device to the representative who will complete the
        check-in process.
      </p>
    </Step>
    <Step>
      <svelte:fragment slot="header">Provide Keys</svelte:fragment>
      <p>The agreement has been accepted and the deposit has been taken.</p>
      <p>
        Provide the keys for the <b
          >{data.reservation.car.year}
          {data.reservation.car.colourStr}
          {data.reservation.car.make}
          {data.reservation.car.model}</b>
        to the customer, then click <b>Complete</b>.
      </p>
    </Step>
  </Stepper>
</form>
