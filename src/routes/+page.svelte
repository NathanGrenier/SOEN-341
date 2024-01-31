<script lang="ts">
  import TransmissionIcon from "$lib/icons/TransmissionIcon.svelte";
  import { getToastStore, getModalStore } from "@skeletonlabs/skeleton";
  import type { ToastSettings, ModalSettings } from "@skeletonlabs/skeleton";

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const testToast: ToastSettings = {
    message: "This is a test toast. It will disappear in 3 seconds.",
    timeout: 3000,
    hoverable: true,
  };

  const testModal: ModalSettings = {
    type: "alert",
    // Data
    title: "Example Alert",
    body: "This is an example modal.",
    image: "https://i.imgur.com/WOgTG96.gif",
  };
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <h1 class="text-4xl font-bold">Welcome to SvelteKit</h1>
  <div class="container flex flex-row items-center justify-center gap-4">
    <button
      class="variant-filled-primary btn w-52"
      on:click={() => {
        toastStore.trigger(testToast);
      }}>Test Toast</button>
    <button
      class="variant-outline-primary btn w-52"
      on:click={() => modalStore.trigger(testModal)}>Test Modal</button>
    <TransmissionIcon />
  </div>
</div>
