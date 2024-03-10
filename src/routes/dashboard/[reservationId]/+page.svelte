<script lang="ts">
  // import { page } from "$app/stores";

  export let data;
</script>

<div class="card">
  <header class="card-header">(header)</header>
  <section class="p-4"><pre>{JSON.stringify(data, null, 2)}</pre></section>
  <footer class="card-footer">(footer)</footer>
</div>
