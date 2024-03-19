<script lang="ts">
  import { enhance } from "$app/forms";
  // import { error } from "@sveltejs/kit";
  import { onMount } from "svelte";
  // import { put } from "@vercel/blob";

  let isDefined = false;
  export let imageBlobUrl: string;

  export const data = null;
  export const form = null;

  // const { blobs } = data;

  function handleDelete() {
    // Implementation for deleting the image (and update database)
    imageBlobUrl = "";
    isDefined = false;
  }

  onMount(async () => {
    // Load existing imageBlobUrl if available from database
    if (imageBlobUrl) {
      isDefined = true;
    }
  });
</script>

{#if isDefined}
  <img
    class="h-60 max-w-full rounded-lg"
    src={imageBlobUrl}
    alt={imageBlobUrl} />
  <button on:click={handleDelete}>Delete</button>
{/if}

<form
  use:enhance={form}
  action="?/action"
  method="POST"
  enctype="multipart/form-data">
  <input class="input" type="file" name="file" required />
  <button class="button" type="submit">Upload</button>
</form>
