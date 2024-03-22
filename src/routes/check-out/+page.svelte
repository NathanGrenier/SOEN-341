<script lang="ts">
  export let data;
</script>

<div class="justifp-center flex flex-col items-center gap-4">
  <div style="min-width: 54em;" class="card min-w-fit flex-grow">
    <header class="card-header flex justify-center font-bold">
      <h1 class="text-4xl">Check-out</h1>
    </header>
    <section class="flex flex-col gap-3 p-4">
      <form method="POST" class="flex flex-col gap-3">
        <input type="hidden" name="reservationId" value={data.reservation.id} />
        <p>Customer: <b>{data.reservation.holder.name}</b></p>
        <p>
          Car being returned: <b
            >{data.reservation.car.year}
            {data.reservation.car.colour}
            {data.reservation.car.make}
            {data.reservation.car.model}</b>
        </p>
        <p>
          Previously reported damage: <b
            >{data.reservation.checkInReportedDamages || "none"}</b>
        </p>
        <p>
          Deposit amount taken: <b
            >${((data.reservation.depositAmountTaken || 0) / 100).toFixed(
              2,
            )}</b>
        </p>
        <p>
          The deposit will be refunded to the card on file ending <b
            >{data.reservation.creditCardNumber}</b
          >.
        </p>
        <p>
          Final balance: <b
            >${(data.reservation.quotedPrice / 100).toFixed(2)}</b>
        </p>
        <label class="label">
          <span>Payment method for final balance:</span>
          <select name="paymentMethod" class="select">
            <option value="CARD_ON_FILE"
              >Card on file - {data.reservation.creditCardNumber}</option>
            <option value="CASH">Cash at branch</option>
          </select>
        </label>
        <button class="variant-filled-primary btn mt-4" type="submit"
          >Confirm Return</button>
        <a
          class="mt-4 flex justify-center text-sm text-tertiary-500 underline"
          href="/dashboard">Return to dashboard</a>
      </form>
    </section>
  </div>
</div>
