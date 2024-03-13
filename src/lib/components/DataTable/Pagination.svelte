<script lang="ts">
  import type { DataHandler } from "@vincjo/datatables";
  export let handler: DataHandler;
  const pageNumber = handler.getPageNumber();
  const pageCount = handler.getPageCount();
  const pages = handler.getPages({ ellipsis: true });
</script>

<!-- Desktop buttons -->
<section
  class="variant-ghost-surface btn-group hidden h-10 lg:block [&>*+*]:border-surface-500">
  <button
    type="button"
    class="hover:variant-soft-primary"
    class:disabled={$pageNumber === 1}
    on:click={() => handler.setPage("previous")}>
    ←
  </button>
  {#each $pages as page}
    <button
      type="button"
      class="hover:variant-soft-primary"
      class:active={$pageNumber === page}
      class:ellipse={page === null}
      on:click={() => handler.setPage(page)}>
      {page ?? "..."}
    </button>
  {/each}
  <button
    type="button"
    class="hover:variant-soft-primary"
    class:disabled={$pageNumber === $pageCount}
    on:click={() => handler.setPage("next")}>
    →
  </button>
</section>

<!-- Mobile buttons -->
<section class="lg:hidden">
  <button
    type="button"
    class="variant-ghost-surface btn mb-2 mr-2 hover:variant-soft-primary"
    class:disabled={$pageNumber === 1}
    on:click={() => handler.setPage("previous")}>
    ←
  </button>
  <button
    type="button"
    class="variant-ghost-surface btn mb-2 hover:variant-soft-primary"
    class:disabled={$pageNumber === $pageCount}
    on:click={() => handler.setPage("next")}>
    →
  </button>
</section>
