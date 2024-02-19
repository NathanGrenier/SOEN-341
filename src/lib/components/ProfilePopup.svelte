<script lang="ts">
  import UserSettingsIcon from "$lib/icons/UserSettingsIcon.svelte";
  import UserIcon from "$lib/icons/UserIcon.svelte";

  export let loggedIn: boolean;
</script>

<div
  style="margin: 1px"
  class="card variant-filled w-44 p-4 shadow-xl"
  data-popup="profilePopup">
  <div class="variant-filled arrow" />

  {#if loggedIn}
    <div class=" variant-filled btn-group-vertical w-full">
      <button
        style="justify-content: start;"
        class=" bg-secondary-hover-token gap-2"
        ><UserIcon invertColor={true} /><span>Profile</span></button>
      <button
        style="justify-content: start;"
        class="bg-secondary-hover-token gap-2"
        ><UserSettingsIcon invertColor={true} /><span>Settings</span></button>
    </div>
    <div>
      <a
        class="variant-filled-error btn mt-2 w-full"
        href="/auth/logout"
        data-sveltekit-reload>Log Out</a>
    </div>
  {:else}
    <div>
      <a class="variant-filled-primary btn mt-2 w-full" href="/auth/login"
        >Log In</a>
      <a class="variant-filled-secondary btn mt-2 w-full" href="/auth/register"
        >Create Account</a>
    </div>
  {/if}
</div>
