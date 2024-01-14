<script lang="ts">
  //   This component provides an example of how to create a custom skeleton modal component. Taken from: https://github.com/skeletonlabs/skeleton/blob/master/sites/skeleton.dev/src/lib/modals/examples/ModalExampleForm.svelte

  import type { SvelteComponent } from "svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";

  const modalStore = getModalStore();

  export let parent: SvelteComponent;

  const formData = {
    name: "Jane Doe",
    tel: "214-555-1234",
    email: "jdoe@email.com",
  };

  function onFormSubmit(): void {
    alert("Not implemented yet.");
    modalStore.close();
  }

  const cBase = "card p-4 w-modal shadow-xl space-y-4";
  const cHeader = "text-2xl font-bold";
  const cForm =
    "border border-surface-500 p-4 space-y-4 rounded-container-token";
</script>

{#if $modalStore[0]}
  <div class="modal-example-form {cBase}">
    <header class={cHeader}>{$modalStore[0].title ?? "(title missing)"}</header>
    <article>{$modalStore[0].body ?? "(body missing)"}</article>
    <!-- Enable for debugging: -->
    <form class="modal-form {cForm}">
      <label class="label">
        <span>Name</span>
        <input
          class="input"
          type="text"
          bind:value={formData.name}
          placeholder="Enter name..." />
      </label>
      <label class="label">
        <span>Phone Number</span>
        <input
          class="input"
          type="tel"
          bind:value={formData.tel}
          placeholder="Enter phone..." />
      </label>
      <label class="label">
        <span>Email</span>
        <input
          class="input"
          type="email"
          bind:value={formData.email}
          placeholder="Enter email address..." />
      </label>
    </form>
    <!-- prettier-ignore -->
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Submit Form</button>
    </footer>
  </div>
{/if}
