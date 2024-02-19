<script lang="ts">
  import CloseIcon from "$lib/icons/CloseIcon.svelte";
  import ExclamationCircleIcon from "$lib/icons/ExclamationCircleIcon.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let emailInput: HTMLInputElement;

  onMount(() => {
    emailInput.focus();
  });

  export let form;
  let showErrors = form?.error != null;

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<pre>{JSON.stringify(data.cars, null, 2)}</pre>

<div class="flex flex-col items-center justify-center gap-4">
  <div style="min-width: 36em;" class="card min-w-fit flex-grow">
    <header class="text4xl card-header flex justify-center font-bold">
      <h1 class="text-4xl">Log In</h1>
    </header>
    <section class="p-4">
      <form method="POST" class="flex flex-col gap-3">
        {#if showErrors}
          <aside
            style="min-width: 32em;"
            class="alert variant-filled-error max-w-lg self-center"
            transition:fade|local={{ duration: 200 }}>
            <!-- Icon -->
            <div><ExclamationCircleIcon height="h-10" width="w-10" /></div>
            <!-- Message -->
            <div class="alert-message">
              <h3 class="h3 font-bold">{form?.error}</h3>
              <p>{form?.errorMessage}</p>
            </div>
            <!-- Actions -->
            <div class="alert-actions">
              <button
                class="variant-filled btn-icon"
                on:click={(e) => {
                  e.preventDefault();
                  showErrors = false;
                }}><CloseIcon invertColor={true} /></button>
            </div>
          </aside>
        {/if}
        <label class="label">
          <span>Email</span>
          <input
            bind:this={emailInput}
            class="input"
            title="Email address"
            name="email"
            type="email"
            value={form?.email ?? ""}
            placeholder="example@domain.com"
            required />
        </label>
        <label class="label">
          <span>Password</span>
          <input
            class="input"
            title="Password"
            name="password"
            type="password"
            required />
        </label>
        <button class="variant-filled-primary btn mt-4" type="submit"
          >Log in</button>
      </form>
    </section>
    <footer class="card-footer mt-2 flex items-center justify-around">
      <p class="font-bold">Don't have an account?</p>
      <a class="variant-filled-secondary btn" href="/auth/register"
        >Create Account</a>
    </footer>
  </div>
</div>
