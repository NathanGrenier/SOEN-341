<script lang="ts">
  import { Paginator, Table, tableMapperValues } from "@skeletonlabs/skeleton";
  import type { PaginationSettings, TableSource } from "@skeletonlabs/skeleton";

  export let data;
  console.log(data);

  type DisplayReservation = Omit<
    (typeof data.userReserverations)[0],
    "plannedDepartureAt" | "plannedReturnAt" | "quotedPrice"
  > & {
    plannedDepartureAt: string;
    plannedReturnAt: string;
    quotedPrice: string;
  };

  function formatReservations(
    reservations: typeof data.userReserverations,
  ): DisplayReservation[] {
    return reservations.map((item) => {
      return {
        ...item,
        plannedDepartureAt: new Date(item.plannedDepartureAt).toLocaleString(),
        plannedReturnAt: new Date(item.plannedReturnAt).toLocaleString(),
        quotedPrice: `${item.quotedPrice.toLocaleString()}$`,
      };
    });
  }

  let formatedReservations = formatReservations(data.userReserverations);

  $: formatedReservations = formatReservations(data.userReserverations);

  console.log(formatedReservations);

  const tableSource: TableSource = {
    head: ["Car", "Departure Time", "Return Time", "Price"],
    // The data visibly shown in your table body UI.
    body: tableMapperValues(formatedReservations, [
      "car",
      "plannedDepartureAt",
      "plannedReturnAt",
      "quotedPrice",
    ]),
    // Optional: The data returned when interactive is enabled and a row is clicked.
    meta: tableMapperValues(data.userReserverations, ["id"]),
    // Optional: A list of footer labels.
    // foot: ["Total", "", '<code class="code">5</code>'],
  };

  let paginationSettings = {
    page: 0,
    limit: 5,
    size: tableSource.body.length,
    amounts: [2, 5, 10],
  } satisfies PaginationSettings;

  $: paginationSettings.size = tableSource.body.length;

  function onPageChange(e: CustomEvent): void {
    fetch(`http://localhost:3000/api/reservations?page=${e.detail}`);
    console.log("event:page", e.detail);
  }

  function onAmountChange(e: CustomEvent): void {
    console.log("event:amount", e.detail);
  }
</script>

<div class="flex flex-col gap-2">
  <Table interactive={true} source={tableSource} />
  <Paginator
    bind:settings={paginationSettings}
    showFirstLastButtons={true}
    showPreviousNextButtons={true}
    on:page={onPageChange}
    on:amount={onAmountChange} />
</div>
