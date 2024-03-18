<script lang="ts">
  import { goto, invalidateAll, replaceState } from "$app/navigation";
  import CloseIcon from "$lib/icons/CloseIcon.svelte";
  import {
    Paginator,
    type PaginationSettings,
    getModalStore,
    type ModalSettings,
    type ToastSettings,
    getToastStore,
  } from "@skeletonlabs/skeleton";
  import type { TableType } from "../../routes/dashboard/+page.svelte";
  import type { TabStatus } from "../../routes/dashboard/+page.svelte";
  import { page } from "$app/stores";
  import { cubicOut } from "svelte/easing";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { tablePages } from "$lib/stores";

  export let table: TableType;
  export let active = true;
  export let tabStatus: TabStatus;

  onMount(async () => {
    // Load the current page from the store
    const pages = $tablePages;
    if (pages[tabStatus]) {
      paginationSettings.page = pages[tabStatus] ?? 0;
    }
  });

  let paginationSettings = {
    page: 0,
    limit: Number($page.url.searchParams.get("amount")) || 5,
    size: 0,
    amounts: [2, 5, 8],
  } satisfies PaginationSettings;

  $: paginationSettings.size = table.body.length;

  $: paginatedBody = table.body.slice(
    paginationSettings.page * paginationSettings.limit,
    paginationSettings.page * paginationSettings.limit +
      paginationSettings.limit,
  );

  function onPageChange(e: CustomEvent): void {
    tablePages.update((pages) => {
      pages[tabStatus] = e.detail;
      return pages;
    });

    paginationSettings.page = e.detail;
  }

  function onAmountChange(e: CustomEvent) {
    paginationSettings.limit = e.detail;
    const params = Object.fromEntries($page.url.searchParams.entries());
    replaceState(
      `/dashboard?status=${params["status"] || "active"}&amount=${e.detail}`,
      {},
    );
    $page.url.searchParams.set("amount", e.detail.toString());
  }

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  async function cancelReservation(id: number) {
    new Promise<boolean>((resolve) => {
      const cancelConfirmationModal: ModalSettings = {
        type: "confirm",
        buttonTextCancel: "Return",
        title: "Confirm Cancellation",
        body: "Are you sure you want to cancel this reservation?",
        // TRUE if confirm pressed, FALSE if cancel pressed
        response: (r: boolean) => resolve(r),
      };
      modalStore.trigger(cancelConfirmationModal);
    }).then((confirm: boolean) => {
      if (!confirm) return;

      const formData = new FormData();
      formData.append("id", id.toString());
      fetch("/dashboard?/cancelReservation", {
        method: "POST",
        body: formData,
      }).then((res: Response) => {
        console.log(res);
        if (res.ok) {
          invalidateAll();
        } else {
          const cancelErrorToast: ToastSettings = {
            message: "There was an error while cancelling the reservation.",
            background: "variant-filled-error",
            autohide: false,
          };

          toastStore.trigger(cancelErrorToast);
        }
      });
    });
  }
</script>

{#if table.body.length === 0}
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          {#each table.head as head}
            <th>{head}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan={table.head.length + 1} class="text-center"
            ><span class=" text-2xl font-bold">No reservations found</span></td>
        </tr>
      </tbody>
    </table>
  </div>
{:else}
  <div class="flex flex-col gap-2">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            {#each table.head as head}
              <th>{head}</th>
            {/each}
            {#if active}
              <!-- Empty cell for the cancel button -->
              <th></th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#each paginatedBody as row (row.id)}
            <tr
              animate:flip={{ duration: 100, easing: cubicOut }}
              on:click={() => goto(`/dashboard/${row.id}`)}>
              <td>{row.car.branch.name}</td>
              <td>{`${row.car.make} ${row.car.model} ${row.car.year}`}</td>
              <td>{row.plannedDepartureAt}</td>
              <td>{row.plannedReturnAt}</td>
              <td>{row.quotedPrice}</td>
              {#if active}
                <td class="table-cell-fit">
                  <button
                    class="variant-filled-error btn"
                    on:click|stopPropagation={() => cancelReservation(row.id)}
                    ><span>Cancel</span><CloseIcon constColor={true} /></button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <Paginator
      bind:settings={paginationSettings}
      showFirstLastButtons={true}
      showPreviousNextButtons={true}
      on:page={onPageChange}
      on:amount={onAmountChange} />
  </div>
{/if}

<style>
  tr > td {
    vertical-align: middle;
  }
</style>
