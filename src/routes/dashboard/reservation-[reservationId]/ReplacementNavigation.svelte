<script lang="ts">
  import CarIcon from "$lib/icons/CarIcon.svelte";
  import type { PageDataReservation } from "./+page.svelte";

  export let reservation: PageDataReservation;
</script>

<ol class="breadcrumb mt-1">
  {#if reservation.replaces}
    <li class="crumb">
      <a
        class="anchor"
        title="Replaced by current reservation"
        data-sveltekit-reload
        href={`/dashboard/reservation-${reservation.replaces?.id}`}>Replaces</a>
    </li>
    <li class="crumb-separator" aria-hidden>&lsaquo;</li>
  {/if}
  {#if reservation.replacedBy || reservation.replaces}
    <li class="crumb" title={`Current Reservation ID: ${reservation.id}`}>
      <CarIcon />
    </li>
  {/if}
  {#if reservation.replacedBy}
    <li class="crumb-separator" aria-hidden>&rsaquo;</li>
    <li>
      <a
        class="anchor"
        title="Replaces current reservation"
        data-sveltekit-reload
        href={`/dashboard/reservation-${reservation.replacedBy?.id}`}
        >Replaced By</a>
    </li>
  {/if}
</ol>
