<script lang="ts">
  import UserSettingsIcon from "$lib/icons/UserSettingsIcon.svelte";
  import UserIcon from "$lib/icons/UserIcon.svelte";
</script>

<div
  style="margin: 1px"
  class="card variant-filled w-44 p-4 shadow-xl"
  data-popup="profilePopup">
  <div class="variant-filled arrow" />
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
    <button class="variant-filled-error btn mt-2 w-full">Logout</button>
  </div>
</div>
