<script lang="ts">
  import { modeCurrent } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";

  let currentMode: boolean;

  $: currentMode = $modeCurrent;

  let videoReady = false;

  onMount(() => {
    currentMode = $modeCurrent;
    videoReady = true;
  });
</script>

<div class="content-container">
  <div class="video-container">
    {#if videoReady}
      <video
        src="HomePageVid.mp4"
        autoplay
        muted
        playsinline
        class="full-bleed-video video {!currentMode ? 'z-low' : 'z-high'}">
        Your browser does not support the video tag.
      </video>
      <video
        src="DarkModeVideo.mp4"
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
  <div class="box-overlay">
    <div class="container mx-auto py-10">
      <div class="info-boxes">
        <div class="info-box smokewhite">
          <div class="box-content">
            <h2 class="mb-4 text-2xl font-bold">
              View our catalog of vehicles
            </h2>
            <p class="mt-4 text-lg">
              Explore our wide range of available vehicles for rental. From
              compact cars to luxury SUVs, we have something for everyone.
            </p>
          </div>
          <img src="car3hp.jpg" alt="Vehicle Catalog" class="box-image" />
        </div>
        <div class="info-box smokewhite">
          <div class="box-content">
            <h2 class="mb-4 text-2xl font-bold">View our Payment Plans</h2>
            <p class="mt-4 text-lg">
              Discover our flexible payment plans tailored to your budget and
              needs. Renting a car has never been easier!
            </p>
          </div>
          <img src="car2hp.jpg" alt="Payment Plans" class="box-image" />
        </div>
        <div class="info-box smokewhite">
          <div class="box-content">
            <h2 class="mb-4 text-2xl font-bold">Find a Branch Near You</h2>
            <p class="mt-4 text-lg">
              Locate our branches conveniently located across the city. We're
              always nearby to provide you with the best car rental experience.
            </p>
          </div>
          <img src="car1hp.jpg" alt="Branch Locator" class="box-image" />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .video-container {
    position: relative;
    width: 100%;
    height: 90vh;
    display: flex;
    align-items: center; /* Vertically centers content */
    justify-content: flex-start; /* Aligns content to the left */
    margin-top: -165px; /* Adjust as needed */
    z-index: 1; /* Ensures stacking context */
  }

  .welcome-text {
    position: absolute;
    left: 38px;
    color: var(--color-tertiary-900);
    font-size: 2rem;
    font-weight: bold;
    z-index: 2;
    top: 27%; /* Adjust for vertical positioning */
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  }

  .full-bleed-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .info-box {
    display: flex;
    justify-content: space-between;
    width: 80%;
    padding: 20px;
    border-radius: 8px;
    color: "bg-tertiary-500";
    margin-bottom: 20px;
    border: 2px solid white;
  }

  .box-content {
    max-width: 50%;
  }

  .box-image {
    max-width: 26%;
    border-radius: 8px;
  }

  .z-low {
    z-index: 1;
  }

  .z-high {
    z-index: 2;
  }
</style>
