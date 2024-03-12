<script lang="ts" context="module">
  import type { PageData } from "./$types";

  export type DisplayReservation = Omit<
    PageData["userReserverations"][0],
    "plannedDepartureAt" | "plannedReturnAt" | "quotedPrice"
  > & {
    plannedDepartureAt: string;
    plannedReturnAt: string;
    quotedPrice: string;
  };

  export type TableType = {
    head: string[];
    body: DisplayReservation[];
  };

  export type TabStatus = "active" | "expired" | "cancelled";
</script>

<script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  import ReservationTable from "$lib/components/ReservationTable.svelte";
  import { replaceState } from "$app/navigation";

  export let data;

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

  $: formatedReservations = formatReservations(data.userReserverations);
  $: table = {
    head: ["Branch", "Car", "Departure Time", "Return Time", "Price"],
    body: formatedReservations,
  };

  let tabSet: TabStatus =
    ($page.url.searchParams.get("status") as TabStatus) || "active";

  function upadteURLState(url: string) {
    replaceState(
      `/dashboard?status=${url}&amount=${$page.url.searchParams.get("amount") ?? 5}`,
      {},
    );
  }
</script>

<h1 class=" text-center text-4xl font-bold">Your Reservations</h1>

<TabGroup>
  <Tab
    bind:group={tabSet}
    name="active"
    value="active"
    on:click={() => upadteURLState("active")}>
    <span class="font-bold">Active</span>
  </Tab>
  <Tab
    bind:group={tabSet}
    name="expired"
    value="expired"
    on:click={() => upadteURLState("expired")}>
    <span class="font-bold">Expired</span></Tab>
  <Tab
    bind:group={tabSet}
    name="cancelled"
    value="cancelled"
    on:click={() => upadteURLState("cancelled")}>
    <span class="font-bold">Cancelled</span></Tab>
  <!-- Tab Panels --->
  <svelte:fragment slot="panel">
    {#if tabSet === "active"}
      <ReservationTable
        table={{
          ...table,
          body: table.body.filter(
            (res) => res.cancelled === false && res.returnedAt === null,
          ),
        }}
        tabStatus={tabSet} />
    {:else if tabSet === "expired"}
      <ReservationTable
        active={false}
        tabStatus={tabSet}
        table={{
          ...table,
          body: table.body.filter((res) => res.returnedAt !== null),
        }} />
    {:else if tabSet === "cancelled"}
      <ReservationTable
        active={false}
        tabStatus={tabSet}
        table={{
          ...table,
          body: table.body.filter((res) => res.cancelled),
        }} />
    {/if}
  </svelte:fragment>
</TabGroup>
