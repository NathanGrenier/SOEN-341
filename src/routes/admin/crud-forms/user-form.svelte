<script lang="ts">
  import {
    getModalStore,
    getToastStore,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";
  import { createEntity, fetchEntityById, updateEntity } from "$lib/utils";
  import type { Car, Reservation, User } from "@prisma/client";

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  const userRoles = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    REP: "REP",
  };

  export let mode = "create";
  export let id = -1;

  let result: {
    entity?: User | Reservation | Car;
    message: string;
    background: string;
  };

  let userEntity: User;

  if (id !== -1) {
    fetchEntityById("User", id).then((res) => {
      result = res;
      userEntity = result.entity as User;
      const t: ToastSettings = {
        message: result.message,
        background: result.background,
      };
      toastStore.trigger(t);
    });
  }

  //@ts-expect-error to shut up the ts error
  async function handleEditSubmit(event) {
    event.preventDefault();

    const finalizedForm = new FormData();

    finalizedForm.append("userId", userEntity.id.toString());
    finalizedForm.append("email", event.target.email.value);
    finalizedForm.append("name", event.target.name.value);
    finalizedForm.append(
      "comment",
      userEntity.comment ? userEntity.comment : "",
    );
    finalizedForm.append("role", event.target.role.value);
    finalizedForm.append("passwordHash", userEntity.passwordHash);
    finalizedForm.append("disabled", event.target.disabled.checked);
    finalizedForm.append("updatedAt", new Date().toISOString());

    const result = await updateEntity("User", finalizedForm);

    const t: ToastSettings = {
      message: result.message,
      background: result.background,
    };

    toastStore.trigger(t);

    if ($modalStore[0].response) $modalStore[0].response(result);

    modalStore.close();
  }

  // @ts-expect-error to shut up the ts error
  async function handleCreateSubmit(event) {
    event.preventDefault();

    const finalizedForm = new FormData();

    finalizedForm.append("name", event.target.name.value);
    finalizedForm.append("comment", event.target.comment.value);
    finalizedForm.append("email", event.target.email.value);
    finalizedForm.append("role", event.target.role.value);
    finalizedForm.append("passwordHash", event.target.passwordHash);
    finalizedForm.append("disabled", event.target.disabled.checked);
    finalizedForm.append("updatedAt", new Date().toISOString());
    finalizedForm.append("createdAt", new Date().toISOString());

    const result = await createEntity("User", finalizedForm);

    const t: ToastSettings = {
      message: result.message,
      background: result.background,
    };

    toastStore.trigger(t);

    if ($modalStore[0].response) $modalStore[0].response(result);

    modalStore.close();
  }
</script>

<div class="card p-4">
  {#if $modalStore[0]}
    {#if mode === "edit"}
      {#if result && userEntity}
        <form on:submit={handleEditSubmit} class="space-y-2">
          <label class="label" for="name">Name</label>
          <input
            class="input"
            type="text"
            id="name"
            name="name"
            bind:value={userEntity.name} />

          <label class="label" for="email">Email</label>
          <input
            class="input"
            type="email"
            name="email"
            bind:value={userEntity.email} />

          <label class="label" for="role">Role</label>
          <select class="select" name="role">
            {#each Object.keys(userRoles) as role}
              <option value={role} selected={role === userEntity.role}
                >{role}</option>
            {/each}
          </select>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                class="checkbox"
                type="checkbox"
                name="disabled"
                id="disabled"
                bind:checked={userEntity.disabled} />
              <p>Check to Disable</p>
            </label>
          </div>
          <button class="btn mx-auto block bg-primary-500" type="submit">
            Save Changes
          </button>
        </form>
      {/if}
    {:else}
      <form on:submit={handleCreateSubmit} class="space-y-2">
        <h4 class="h4">Create User</h4>

        <label class="label" for="name">Name</label>
        <input class="input" type="text" id="name" name="name" />

        <label class="label" for="comment">Comment</label>
        <input class="input" type="text" id="comment" name="comment" />

        <label class="label" for="passwordHash">PasswordHash</label>
        <input
          class="input"
          type="text"
          id="passwordHash"
          name="passwordHash" />

        <label class="label" for="email">Email</label>
        <input class="input" type="email" name="email" />

        <label class="label" for="role">Role</label>
        <select class="select" name="role">
          {#each Object.keys(userRoles) as role}
            <option value={role}>{role}</option>
          {/each}
        </select>

        <label class="flex items-center space-x-2">
          <input
            class="checkbox"
            type="checkbox"
            name="disabled"
            id="disabled" />
          <p>Check to Disable</p>
        </label>

        <button class="btn m-2 mx-auto block bg-primary-500" type="submit">
          Create User
        </button>
      </form>
    {/if}
  {/if}
</div>
