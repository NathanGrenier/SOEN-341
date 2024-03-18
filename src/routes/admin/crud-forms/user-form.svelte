<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  export const parent: SvelteComponent | null = null; //vite, ts AND svelte needs to stop whining bro
  const modalStore = getModalStore();

  const userRoles = {
    //hardcoded for now.
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    REP: "REP",
  };
  import {
    updateUser,
    createUser,
    getUserById,
  } from "$lib/controllers/userController";

  import { onMount } from "svelte";

  export let mode = "create";
  export let id = -1;

  export let data = {
    name: "Name",
    email: "name@email.com",
    role: "CUSTOMER",
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  onMount(async () => {
    if (mode === "edit" && id != -1) {
      try {
        const userInfoById = await getUserById(id);
        data = {
          // Map Prisma properties to your form fields:
          name: userInfoById ? userInfoById.name : "",
          email: userInfoById ? userInfoById.email : "", // Default to an empty string
          role: userInfoById ? userInfoById.role : "CUSTOMER", // Default to 'CUSTOMER'
          disabled: userInfoById ? userInfoById.disabled : false, // Default to false
          createdAt: userInfoById ? userInfoById.createdAt : new Date(), // Default to current time
          updatedAt: userInfoById ? userInfoById.updatedAt : new Date(), // Default to current time
        };
      } catch (error) {
        console.error("Error loading user data:", error);
        // Handle error gracefully - Display message to the user
      }
    }
  });

  //@ts-expect-error to shut up the ts error
  function handleEditSubmit(event) {
    event.preventDefault();

    // Perform form validation (more on this later)
    if (!validateForm()) return; // Prevent submission if invalid

    let result = updateUser(id, {
      name: event.target.name.value,
      email: event.target.email.value,
      role: event.target.role.value,
      disabled: event.target.disabled.checked,
      createdAt: data.createdAt, // Preserve original createdAt
      updatedAt: new Date(),
      // ... add other fields from your User model here
    });

    if ($modalStore[0].response) $modalStore[0].response(result);
    modalStore.close();
  }

  // @ts-expect-error to shut up the ts error
  function handleCreateSubmit(event) {
    event.preventDefault();

    // Perform form validation (more on this later)
    if (!validateForm()) return; // Prevent submission if invalid

    let result = createUser({
      name: event.target.name.value,
      email: event.target.email.value,
      role: event.target.role.value,
      disabled: event.target.disabled.checked,
      createdAt: new Date(),
      updatedAt: new Date(),
      // ... add other fields from your User model here
    });

    if ($modalStore[0].response) $modalStore[0].response(result);
    modalStore.close();
  }

  function validateForm() {
    // Implement your validation logic here.
    // Example:
    if (!data.name.trim()) {
      alert("Please enter a name");
      return false;
    }
    // ... add more validation checks
    return true;
  }
</script>

{#if $modalStore[0]}
  {#if (mode = "edit")}
    <form on:submit={handleEditSubmit}>
      <label class="label" for="name">Name:</label>
      <input
        class="input"
        type="text"
        id="name"
        name="name"
        bind:value={data.name} />

      <label class="label" for="email">Email:</label>
      <input class="input" type="email" name="email" bind:value={data.email} />

      <label class="label" for="role">Role:</label>
      <select class="select" name="role">
        {#each Object.keys(userRoles) as role}
          <option value={role} selected={role === data.role}>{role}</option>
        {/each}
      </select>
      <div class="space-y-2">
        <label class="flex items-center space-x-2">
          <input
            class="checkbox"
            type="checkbox"
            name="disabled"
            bind:checked={data.disabled} />
          <p>Check to Disable</p>
        </label>
      </div>

      <button class="variant-filled btn" type="submit"> Save Changes </button>
    </form>
  {:else}
    <form on:submit={handleCreateSubmit}>
      <label class="label" for="name">Name:</label>
      <input
        class="input"
        type="text"
        id="name"
        name="name"
        bind:value={data.name} />

      <label class="label" for="email">Email:</label>
      <input class="input" type="email" name="email" bind:value={data.email} />

      <label class="label" for="role">Role:</label>
      <select class="select" name="role">
        {#each Object.keys(userRoles) as role}
          <option value={role} selected={role === data.role}>{role}</option>
        {/each}
      </select>
      <!-- <Select items={userRoles} bind:value={data.role} /> -->

      <button class="button" type="submit"> Create User </button>
    </form>
  {/if}
{/if}
