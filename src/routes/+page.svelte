<script lang="ts">
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  import { Canvas, type AsyncWritable } from "@threlte/core";
  import { modeCurrent } from "@skeletonlabs/skeleton";
  import { T } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import { inSphere } from "maath/random";
  import type { TypedArray } from "three";
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { fade } from "svelte/transition";
  import { useLoader } from "@threlte/core";
  import {
    GLTFLoader,
    type GLTF,
  } from "three/examples/jsm/loaders/GLTFLoader.js";

  const tweenedXPosition = tweened(0, {
    duration: 500,
    easing: linear,
  });

  const tweenedYPosition = tweened(0, {
    duration: 500,
    easing: linear,
  });

  const tweenedZPosition = tweened(1, {
    duration: 500,
    easing: linear,
  });

  // Create a tweened store for scroll position
  const scrollPosition = tweened(0, {
    duration: 500,
    easing: linear,
  });

  // Function to set window scroll position
  function setWindowScrollPosition(value: number) {
    if (typeof window !== "undefined") {
      const scrollTop = value;
      document.documentElement.scrollTop = scrollTop;
      document.body.scrollTop = scrollTop;
    }
  }

  // Store for camera position
  const cameraPosition = writable<[number, number, number]>([
    get(tweenedXPosition),
    get(tweenedYPosition),
    get(tweenedZPosition),
  ]);

  $: currentMode = $modeCurrent;

  $: {
    $tweenedXPosition;
    $tweenedYPosition;
    $tweenedZPosition;
    cameraPosition.set([
      get(tweenedXPosition),
      get(tweenedYPosition),
      get(tweenedZPosition),
    ]);
  }

  $: {
    $scrollPosition;
    setWindowScrollPosition($scrollPosition);
  }

  let sphere: TypedArray;
  let scrollAmount = 0;
  let videoReady = false;
  let mouseMove = false;
  let videoEnded = false;
  let isMobile = false;

  let gltf: AsyncWritable<GLTF>;

  onMount(() => {
    sphere = inSphere(new Float32Array(5000), { radius: 1.2 });

    function animate() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - previousTime;
      previousTime = currentTime;

      const angularSpeed = 5;
      if (!mouseMove)
        tweenedXPosition.update(
          (value) =>
            value + (((angularSpeed * elapsedTime) / 1000) * Math.PI) / 180,
        );
      requestAnimationFrame(animate);
    }

    let previousTime = Date.now();
    animate();

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("mousemove", handleMouseMove);

    videoReady = true;

    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    videoEnded = isMobile;

    gltf = useLoader(GLTFLoader).load("./free_car_001.gltf");

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  // Update cursor position
  function handleMouseMove(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const deltaX = x - prevX;
    const deltaY = y - prevY;

    // Update the camera position
    tweenedXPosition.update((prev) => prev + deltaY * -0.0001);
    tweenedYPosition.update((prev) => prev + deltaX * 0.0001);

    prevX = x;
    prevY = y;
  }

  let prevX = 0;
  let prevY = 0;

  function scrollToDiv(sectionName: string) {
    const targetDiv = document.getElementById(sectionName);

    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Tween camera position when scrolling
  function tweenCameraPosition(operation: string) {
    if (operation === "remove")
      tweenedXPosition.update((prev) => {
        return prev - 0.5;
      });
    else
      tweenedXPosition.update((prev) => {
        return prev + 0.5;
      });
  }

  function handleWheel(event: { deltaY: number }) {
    if (event.deltaY < 0) {
      if (scrollAmount % 100 == 0 && scrollAmount !== 0)
        tweenCameraPosition("remove");
      scrollAmount--;
    } else {
      if (scrollAmount % 100 == 0) tweenCameraPosition("add");
      scrollAmount++;
    }

    if (scrollAmount < 0) scrollAmount = 0;
  }

  function handleVideoEnded() {
    videoEnded = true;
  }
</script>

<div class="{currentMode ? 'sceneLight' : 'sceneDark'} z-0">
  <Canvas>
    <!-- Camera -->
    <T.PerspectiveCamera position={[0, 0.6, 0]} fov={50} makeDefault>
      <!-- Controls -->
      <OrbitControls enableZoom={false} enabled={false} enableDamping />
    </T.PerspectiveCamera>

    <!-- Lights the scene equally -->
    <T.AmbientLight color="#ffffff" intensity={0.2} />

    <!-- Light that casts a shadow -->
    <T.DirectionalLight
      color="#ffffff"
      intensity={2}
      position={[10, 10, 0]}
      shadow.camera.top={8}
      castShadow />

    <T.Group rotation={$cameraPosition}>
      <T.Points>
        <T.BufferGeometry>
          <T.BufferAttribute
            args={[sphere, 3]}
            attach={(parent, self) => {
              parent.setAttribute("position", self);
              return () => {};
            }} />
        </T.BufferGeometry>
        <T.PointsMaterial
          color={currentMode ? "black" : "white"}
          size={currentMode ? 0.004 : 0.002}
          sizeAttenuation={true} />
      </T.Points>
    </T.Group>

    {#if $gltf}
      <T is={$gltf.scene} position={[0, 0, 1]} />
    {/if}
  </Canvas>
</div>

<div class="{!isMobile ? 'video-container' : ''} left-0 top-12 z-10 w-full">
  {#if videoReady}
    <div transition:fade={{ delay: 250, duration: 300 }}>
      <video
        src="LightHomePageVid.mp4"
        muted
        autoplay
        playsinline
        on:ended={handleVideoEnded}
        class="{isMobile ? 'hidden' : ''} video {!currentMode
          ? 'z-low'
          : 'z-high'}">
        Your browser does not support the video tag.
      </video>
      <video
        src="DarkHomePageVid.mp4"
        muted
        autoplay
        playsinline
        class="{isMobile ? 'hidden' : ''} video {currentMode
          ? 'z-low'
          : 'z-high'}">
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="absolute z-20 space-y-4 md:pl-32 md:pt-20">
      {#if videoEnded}
        <div
          transition:fade={{ delay: 250, duration: 300 }}
          class="justify-center pt-20 text-2xl font-extrabold">
          Welcome to DriveXperience
        </div>
        <button
          on:click={() => {
            scrollToDiv("sectionOne");
          }}
          transition:fade={{ delay: 250, duration: 300 }}
          class="variant-filled-primary btn mx-auto block">Begin</button>
      {/if}
    </div>
  {/if}
</div>

<div class="card fixed left-0 top-0 z-30 p-4">{$scrollPosition}</div>

<div class="relative space-y-4 p-4">
  <div id="sectionOne" class="h-screen w-auto p-4">Section One</div>
  <div id="sectionTwo" class="h-screen w-auto p-4">Section Two</div>
  <div id="sectionThree" class="h-screen w-auto p-4">Section Three</div>
</div>

<style>
  .sceneDark {
    position: absolute;
    inset: 0;
    background: radial-gradient(hsl(220 14% 20%), hsl(220 20% 10%));
  }

  .sceneLight {
    position: absolute;
    inset: 0;
    background: radial-gradient(hsl(220 80% 90%), hsl(220 60% 80%));
  }

  .z-low {
    z-index: 1;
    opacity: 0;
  }

  .z-high {
    z-index: 2;
    opacity: 1;
  }

  .z-low,
  .z-high {
    transition: opacity 0.3s ease;
  }

  .video-container {
    position: relative;
    width: 100vw;
    height: 93vh;
    top: -2.5rem;
    left: -14.5rem;
    overflow: hidden;
  }

  .video-container video {
    width: 100%;
    height: auto;
    position: absolute;
    top: -5rem;
    left: 0;
  }
</style>
