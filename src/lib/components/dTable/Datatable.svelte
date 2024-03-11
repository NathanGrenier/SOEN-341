<script lang="ts">
  //Import local datatable components
  import ThSort from "$lib/components/dTable/ThSort.svelte";
  import ThFilter from "$lib/components/dTable/ThFilter.svelte";
  import Search from "$lib/components/dTable/Search.svelte";
  import RowsPerPage from "$lib/components/dTable/RowsPerPage.svelte";
  import RowCount from "$lib/components/dTable/RowCount.svelte";
  import Pagination from "$lib/components/dTable/Pagination.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let fetchCase = -1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let userData: any;

  console.log("buttoncase=" + fetchCase);

  function handleClick(rowId: number) {
    console.log("rowIDselectedInDatatable=" + rowId);
    dispatch("rowClick", rowId);
  }

  //Import handler from SSD
  import { DataHandler } from "@vincjo/datatables";

  //Init data handler - CLIENT
  const handler = new DataHandler(userData, { rowsPerPage: 5 });
  const rows = handler.getRows();
</script>

{#if fetchCase == 1}
  <!--User: ID, Name, Email, Role-->
  <div class=" space-y-4 overflow-x-auto">
    <!-- Header -->
    <header class="flex justify-between gap-4">
      <Search {handler} />
      <RowsPerPage {handler} />
    </header>
    <!-- Table -->
    <table class="table table-interactive table-compact w-full table-auto">
      <thead>
        <tr>
          <ThSort {handler} orderBy="id">ID</ThSort>
          <ThSort {handler} orderBy="name">Name</ThSort>
          <ThSort {handler} orderBy="email">Email</ThSort>
          <ThSort {handler} orderBy="role">Role</ThSort>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="name" />
          <ThFilter {handler} filterBy="email" />
          <ThFilter {handler} filterBy="role" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr on:click={() => handleClick(row.id)}>
            <td>{row.id}</td>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.role}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <!-- Footer -->
    <footer class="flex justify-between">
      <RowCount {handler} />
      <Pagination {handler} />
    </footer>
  </div>
{:else if fetchCase == 2}
  <!--Vehicle:ID, Model, BookingDisabled, Branch-->
  <div class=" space-y-4 overflow-x-auto">
    <!-- Header -->
    <header class="flex justify-between gap-4">
      <Search {handler} />
      <RowsPerPage {handler} />
    </header>
    <!-- Table -->
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <ThSort {handler} orderBy="id">ID</ThSort>
          <ThSort {handler} orderBy="model">Model</ThSort>
          <ThSort {handler} orderBy="bookingDisabled">BookingDisabled</ThSort>
          <ThSort {handler} orderBy="branchId">Branch Id</ThSort>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="model" />
          <ThFilter {handler} filterBy="bookingDisabled" />
          <ThFilter {handler} filterBy="branchId" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr on:click={() => handleClick(row.id)}>
            <td>{row.id}</td>
            <td>{row.model}</td>
            <td>{row.bookingDisabled}</td>
            <td>{row.branchId}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <!-- Footer -->
    <footer class="flex justify-between">
      <RowCount {handler} />
      <Pagination {handler} />
    </footer>
  </div>
{:else}
  <!--Reservations:ID, HolderID, Cancelled, quotedPrice-->
  <div class=" space-y-4 overflow-x-auto">
    <!-- Header -->
    <header class="flex justify-between gap-4">
      <Search {handler} />
      <RowsPerPage {handler} />
    </header>
    <!-- Table -->
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <ThSort {handler} orderBy="id">ID</ThSort>
          <ThSort {handler} orderBy="holderId">Holder ID</ThSort>
          <ThSort {handler} orderBy="cancelled">Cancelled?</ThSort>
          <ThSort {handler} orderBy="quotedPrice">Quoted Price</ThSort>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="holderId" />
          <ThFilter {handler} filterBy="cancelled" />
          <ThFilter {handler} filterBy="quotedPrice" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr on:click={() => handleClick(row.id)}>
            <td>{row.id}</td>
            <td>{row.holderId}</td>
            <td>{row.cancelled}</td>
            <td>{row.quotedPrice}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <!-- Footer -->
    <footer class="flex justify-between">
      <RowCount {handler} />
      <Pagination {handler} />
    </footer>
  </div>
{/if}
