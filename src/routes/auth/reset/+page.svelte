<script lang="ts">
  import CloseIcon from "$lib/icons/CloseIcon.svelte";
  import ExclamationCircleIcon from "$lib/icons/ExclamationCircleIcon.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let passwordInput: HTMLInputElement;

  onMount(() => {
    passwordInput.focus();
  });

  export let form;

  // TODO: Implement disabling submit when submission is in progress
  let showErrors = form?.error != null;

  // TODO: This redirects to the home page. It would be nice to have a toast on that page. Would it be
  // better to have some sort of global toast store?
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <div style="min-width: 36em;" class="card min-w-fit flex-grow">
    <header class="text4xl card-header flex justify-center font-bold">
      <h1 class="text-4xl">Reset Password</h1>
    </header>
    <section class="p-4">
      <form method="POST" class="flex flex-col gap-3">
        {#if showErrors}
          <aside
            style="min-width: 32em;"
            class="alert variant-filled-error max-w-lg self-center"
            transition:fade|local={{ duration: 200 }}>
            <!-- Icon -->
            <div>
              <ExclamationCircleIcon
                constColor={true}
                height="h-10"
                width="w-10" />
            </div>
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
          <span>Password</span>
          <input
            bind:this={passwordInput}
            class="input"
            title="Password"
            name="passwordRaw"
            type="password"
            required />
        </label>
        <label class="label">
          <span>Confirm Password</span>
          <input
            class="input"
            title="Confirm Password"
            name="confirmPassword"
            type="password"
            required />
        </label>
        <p>Passwords must:</p>
        <ul class="list-inside list-disc">
          <li>Be at least 8 characters long</li>
          <li>Contain an uppercase letter</li>
          <li>Contain a lowercase letter</li>
          <li>Contain a digit</li>
        </ul>
        <button class="variant-filled-primary btn mt-4" type="submit"
          >Set New Password</button>
      </form>
    </section>
    <footer class="card-footer mt-2 flex items-center justify-around"></footer>
  </div>
</div>
