<script lang="ts">
  import { page } from "$app/stores";
  import ExclamationCircleIcon from "$lib/icons/ExclamationCircleIcon.svelte";
</script>

<div class="flex justify-center">
  <aside style="min-width: 32em;" class="alert variant-filled-error max-w-xl">
    <!-- Icon -->
    <div>
      <ExclamationCircleIcon constColor={true} height="h-10" width="w-10" />
    </div>
    <!-- Message -->
    <div class="alert-message">
      <h3 class="h3 font-bold">{`Error: ${$page?.status}`}</h3>
      <p>{$page.error?.message}</p>
    </div>
    <!-- Actions -->
    <div class="alert-actions">
      <a href="/dashboard" class="variant-filled btn">Return to Dashboard</a>
    </div>
  </aside>
</div>
