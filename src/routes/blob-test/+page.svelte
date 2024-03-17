<script lang="ts">
  import { enhance } from "$app/forms";
  export let data;
  export let form;

  const { blobs } = data;
</script>

<form use:enhance action="?/upload" method="POST" enctype="multipart/form-data">
  <input class="input" type="file" name="file" required />
  <button type="submit" class="variant-filled-primary btn">Upload</button>
</form>

{#if form}
  <p>uploaded {form.uploaded.url}</p>
{/if}

{#if blobs}
  <section class="grid grid-cols-2 gap-4 md:grid-cols-3">
    {#each blobs as blob}
      <div>
        <img
          class="h-60 max-w-full rounded-lg"
          src={blob.downloadUrl}
          alt={blob.pathname} />
        <p>DownloadUrl: {blob.downloadUrl}</p>
      </div>
    {/each}
  </section>
{/if}
