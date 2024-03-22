<script lang="ts">
  import CheckCircleIcon from "$lib/icons/CheckCircleIcon.svelte";
</script>

<div class="flex justify-center">
  <aside style="min-width: 32em;" class="alert variant-filled-success max-w-xl">
    <!-- Icon -->
    <div>
      <CheckCircleIcon constColor={true} height="h-10" width="w-10" />
    </div>
    <!-- Message -->
    <div class="alert-message">
      <h3 class="h3 font-bold">Check-in complete</h3>
    </div>
    <!-- Actions -->
    <div class="alert-actions">
      <a href="/dashboard" class="variant-filled btn">Return to Dashboard</a>
    </div>
  </aside>
</div>
