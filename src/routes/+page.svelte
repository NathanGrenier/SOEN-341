<script lang="ts">
  import { modeCurrent } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let currentMode: boolean;
  $: currentMode = $modeCurrent;
  let videoReady = false;

  onMount(() => {
    currentMode = $modeCurrent;
    videoReady = true;
  });

  let promoHover = false; // State to handle hover style for promo button
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
  <!-- Company Information Section -->
  <div
    class="company-info"
    style="padding: 80px; text-align: center; margin-top: -160px;">
    <h2 style="font-size: 2.5em; margin-bottom: 0.75em; line-height: 1.2;">
      DriveXperience offers premium driving experiences across the country.
    </h2>
    <h2 style="font-size: 2em; margin-bottom: 0.75em; line-height: 1.2;">
      From luxury cars to everyday commuter cars, we have something for
      everyone.
    </h2>
    <h2 style="font-size: 2em; margin-bottom: 0.75em; line-height: 1.2;">
      Discover our available models today!
    </h2>
  </div>

  <div
    class="promotions-section"
    style="padding: 80px; text-align: center; margin-top: -30px;">
    <h2 style="font-size: 2em; margin-bottom: 0.75em; line-height: 1.2;">
      Explore Exclusive Offers at DriveXperience
    </h2>
    <button
      class="promo-button"
      on:click={() => goto("/our-promotions")}
      on:mouseenter={() => (promoHover = true)}
      on:mouseleave={() => (promoHover = false)}
      style="background-color: {promoHover
        ? '#ffdd22'
        : '#f5f5f5'}; color: #333; padding: 10px 20px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; margin-top: 20px;">
      View Promotions
    </button>
  </div>
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
