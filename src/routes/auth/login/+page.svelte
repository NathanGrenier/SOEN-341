<script lang="ts">
  import { onMount } from "svelte";

  let emailInput: HTMLInputElement;

  onMount(() => {
    emailInput.focus();
  });
</script>

<div class="flex justify-center">
  <div class="card max-w-xl flex-grow">
    <header class="text4xl card-header flex justify-center font-bold">
      <h1 class="text-4xl">Log In</h1>
    </header>
    <section class="p-4">
      <form method="POST" class="flex flex-col gap-3">
        <label class="label">
          <span>Email</span>
          <input
            class="input"
            title="Email address"
            name="email"
            type="text"
            bind:this={emailInput}
            placeholder="you@somewhere.example"
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
      <button class="variant-filled-secondary btn">Create Account</button>
    </footer>
  </div>
</div>
