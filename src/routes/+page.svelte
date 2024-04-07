<script lang="ts">
  import { modeCurrent } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import { Drawer, Button, CloseButton } from "flowbite-svelte";
  import { InfoCircleSolid, ArrowRightOutline } from "flowbite-svelte-icons";
  import { sineIn } from "svelte/easing";

  let currentMode: boolean;
  $: currentMode = $modeCurrent;
  let videoReady = false;

  onMount(() => {
    currentMode = $modeCurrent;
    videoReady = true;
  });

  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };

  let isDrawerOpen = false;

  function toggleDrawer() {
    isDrawerOpen = !isDrawerOpen;
  }
</script>

<div class="content-container">
  <div class="video-container">
    {#if videoReady}
      <video
        src="LightHomePageVid.mp4"
        autoplay
        muted
        playsinline
        class="full-bleed-video video {!currentMode ? 'z-low' : 'z-high'}">
        Your browser does not support the video tag.
      </video>
      <video
        src="DarkHomePageVid.mp4"
        autoplay
        muted
        playsinline
        class="full-bleed-video video {currentMode ? 'z-low' : 'z-high'}">
        Your browser does not support the video tag.
      </video>
      <div class="overlay-text welcome-text z-10">
        Welcome to DriveXperience
      </div>
    {/if}
  </div>

  <div class="mt-4 text-center">
    <Button on:click={toggleDrawer}>Spin the Wheel!</Button>
  </div>

  <Drawer
    transitionType="fly"
    {transitionParams}
    bind:hidden={isDrawerOpen}
    id="sidebar1">
    <div class="flex items-center">
      <h5
        id="drawer-label"
        class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400">
        <InfoCircleSolid class="me-2.5 h-4 w-4" />Info
      </h5>
      <CloseButton
        on:click={() => (isDrawerOpen = false)}
        class="mb-4 dark:text-white" />
    </div>
    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
      Supercharge your hiring by taking advantage of our <a
        href="/"
        class="text-primary-600 underline hover:no-underline dark:text-primary-500">
        limited-time sale
      </a>
      for Flowbite Docs + Job Board. Unlimited access to over 190K top-ranked candidates
      and the #1 design job board.
    </p>
    <div class="grid grid-cols-2 gap-4">
      <Button color="light" href="/">Learn more</Button>
      <Button href="/" class="px-4"
        >Get access <ArrowRightOutline class="ms-2 h-3.5 w-3.5" /></Button>
    </div>
  </Drawer>
</div>

<style>
  .video-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .video-container video {
    width: 100%;
    height: 80%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  .overlay-text {
    position: absolute;
    top: 70px;
    left: 60px;
    color: white;
    font-size: 40px;
    font-weight: bold;
  }

  .z-low,
  .z-high {
    transition: opacity 0.3s ease;
  }

  .z-low {
    z-index: 1;
    opacity: 0;
  }

  .z-high {
    z-index: 2;
    opacity: 1;
  }
</style>
