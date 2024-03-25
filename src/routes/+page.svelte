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

  .box-overlay {
    position: relative;
    min-height: 90vh;
    padding: 0 1rem;
    box-sizing: border-box;
    margin: auto;
  }

  .info-boxes {
    display: flex;
    flex-direction: column;
    margin-top: -140px;
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
