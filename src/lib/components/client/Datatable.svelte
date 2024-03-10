<script lang="ts">
  //Import local datatable components
  import ThSort from "$lib/components/client/ThSort.svelte";
  import ThFilter from "$lib/components/client/ThFilter.svelte";
  import Search from "$lib/components/client/Search.svelte";
  import RowsPerPage from "$lib/components/client/RowsPerPage.svelte";
  import RowCount from "$lib/components/client/RowCount.svelte";
  import Pagination from "$lib/components/client/Pagination.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let fetchCase = -1;

  console.log("buttoncase=" + fetchCase);

  function handleClick(rowId: number) {
    console.log("rowIDselectedInDatatable=" + rowId);
    dispatch("rowClick", rowId);
  }

  //Load local data

  import data from "$lib/components/client/data";

  //Import handler from SSD
  import { DataHandler } from "@vincjo/datatables";

  //Init data handler - CLIENT
  const handler = new DataHandler(data, { rowsPerPage: 5 });
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
    <table class="table table-hover table-compact w-full table-auto">
      <thead>
        <tr>
          <ThSort {handler} orderBy="id">ID</ThSort>
          <ThSort {handler} orderBy="first_name">Name</ThSort>
          <ThSort {handler} orderBy="email">Email</ThSort>
          <ThSort {handler} orderBy="last_name">Role</ThSort>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="first_name" />
          <ThFilter {handler} filterBy="email" />
          <ThFilter {handler} filterBy="last_name" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr on:click={() => handleClick(row.id)}>
            <td>{row.id}</td>
            <td>{row.first_name}</td>
            <td>{row.email}</td>
            <td>{row.last_name}</td>
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
          <ThSort {handler} orderBy="first_name">Model</ThSort>
          <ThSort {handler} orderBy="email">BookingDisabled</ThSort>
          <ThSort {handler} orderBy="last_name">Branch</ThSort>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="first_name" />
          <ThFilter {handler} filterBy="email" />
          <ThFilter {handler} filterBy="last_name" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr on:click={() => handleClick(row.id)}>
            <td>{row.id}</td>
            <td>{row.first_name}</td>
            <td>{row.email}</td>
            <td>{row.last_name}</td>
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
          <ThSort {handler} orderBy="first_name">Holder ID</ThSort>
          <ThSort {handler} orderBy="email">Cancelled?</ThSort>
          <ThSort {handler} orderBy="last_name">Quoted Price</ThSort>
        </tr>
        <tr>
          <ThFilter {handler} filterBy="id" />
          <ThFilter {handler} filterBy="first_name" />
          <ThFilter {handler} filterBy="email" />
          <ThFilter {handler} filterBy="last_name" />
        </tr>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr on:click={() => handleClick(row.id)}>
            <td>{row.id}</td>
            <td>{row.first_name}</td>
            <td>{row.email}</td>
            <td>{row.last_name}</td>
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
