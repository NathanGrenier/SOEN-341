<script lang="ts">
  import { onMount } from "svelte";

  let isDefined = false;

  export let imageBlobUrl: string | null;
  export const form = null;

  // const { blobs } = data;

  function handleDelete() {
    imageBlobUrl = "";
    isDefined = false;
  }

  onMount(async () => {
    if (imageBlobUrl) {
      isDefined = true;
    }
  });

  function handleSubmit(event: {
    preventDefault: () => void;
    target: HTMLFormElement;
  }) {
    event.preventDefault();

    const form = event.target;

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("There was an error while uploading the file.");
        }
        return response.json();
      })
      .then((data) => {
        const parsedResponse = JSON.parse(data.data);

        parsedResponse.forEach((item: string) => {
          if (typeof item === "string" && item.endsWith(".JPG")) {
            imageBlobUrl = item;
          }
        });

        isDefined = true;
      })
      .catch((error) => {
        console.error("Error uploading file:", error.message);
      });
  }
</script>

{#if isDefined}
  <img
    class="h-60 max-w-full rounded-lg"
    src={imageBlobUrl}
    alt={imageBlobUrl} />
  <button on:click={handleDelete}>Delete</button>
{/if}

<form
  action="/admin?/upload"
  method="POST"
  enctype="multipart/form-data"
  on:submit={handleSubmit}>
  <input class="input" type="file" name="file" required />
  <button class="variant-filled btn m-2 mx-auto block" type="submit"
    >Upload</button>
</form>
