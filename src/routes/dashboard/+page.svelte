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

  export type TabStatus = "upcoming" | "in-progress" | "expired" | "cancelled";
</script>

<script lang="ts">
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  import ReservationTable from "$lib/components/ReservationTable.svelte";
  import { replaceState } from "$app/navigation";
  import { centsToDollars } from "$lib/utils";

  export let data;

  function formatReservations(
    reservations: typeof data.userReserverations,
  ): DisplayReservation[] {
    return reservations.map((item) => {
      return {
        ...item,
        plannedDepartureAt: item.plannedDepartureAt.toLocaleString(),
        plannedReturnAt: item.plannedReturnAt.toLocaleString(),
        quotedPrice: centsToDollars(item.quotedPrice),
      };
    });
  }

  $: formatedReservations = formatReservations(data.userReserverations);
  $: table = {
    head: ["Branch", "Car", "Departure Time", "Return Time", "Price"],
    body: formatedReservations,
  };

  let tabSet: TabStatus =
    ($page.url.searchParams.get("status") as TabStatus) || "upcoming";

  function updateURLState(url: string) {
    replaceState(
      `/dashboard?status=${url}&amount=${$page.url.searchParams.get("amount") ?? 5}`,
      {},
    );
  }
</script>

<h1 class=" text-center text-4xl font-bold">Reservations</h1>

<TabGroup>
  <Tab
    bind:group={tabSet}
    name="upcoming"
    value="upcoming"
    on:click={() => updateURLState("upcoming")}>
    <span class="font-bold">Upcoming</span>
  </Tab>
  <Tab
    bind:group={tabSet}
    name="in-progress"
    value="in-progress"
    on:click={() => updateURLState("in-progress")}
    ><span class="font-bold">In-Progress</span></Tab>
  <Tab
    bind:group={tabSet}
    name="expired"
    value="expired"
    on:click={() => updateURLState("expired")}>
    <span class="font-bold">Expired</span></Tab>
  <Tab
    bind:group={tabSet}
    name="cancelled"
    value="cancelled"
    on:click={() => updateURLState("cancelled")}>
    <span class="font-bold">Cancelled</span></Tab>
  <!-- Tab Panels --->
  <svelte:fragment slot="panel">
    {#if tabSet === "upcoming"}
      <ReservationTable
        table={{
          ...table,
          body: table.body.filter(
            (res) => res.cancelled === false && res.pickedUpAt === null,
          ),
        }}
        tabStatus={tabSet}
        role={data.user?.role} />
    {:else if tabSet === "in-progress"}
      <ReservationTable
        table={{
          ...table,
          body: table.body.filter(
            (res) => res.pickedUpAt !== null && res.returnedAt === null,
          ),
        }}
        tabStatus={tabSet}
        role={data.user?.role} />
    {:else if tabSet === "expired"}
      <ReservationTable
        active={false}
        tabStatus={tabSet}
        role={data.user?.role}
        table={{
          ...table,
          body: table.body.filter((res) => res.returnedAt),
        }} />
    {:else if tabSet === "cancelled"}
      <ReservationTable
        active={false}
        tabStatus={tabSet}
        role={data.user?.role}
        table={{
          ...table,
          body: table.body.filter((res) => res.cancelled || res.replacedBy),
        }} />
    {/if}
  </svelte:fragment>
</TabGroup>
