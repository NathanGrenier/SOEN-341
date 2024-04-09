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
  import { linear, quintOut } from "svelte/easing";
  import { fade, slide } from "svelte/transition";
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

  let sphere: TypedArray;
  let scrollPosition = writable(0);
  let videoReady = false;
  let mouseMove = false;
  let videoEnded = false;
  let isMobile = false;

  let gltf: AsyncWritable<GLTF>;

  onMount(() => {
    const handleScroll = () => {
      scrollPosition.set(window.scrollY);
      console.log("yes");
    };

    window.addEventListener("scroll", handleScroll);

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

    window.addEventListener("mousemove", handleMouseMove);

    videoReady = true;

    isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    videoEnded = isMobile;

    gltf = useLoader(GLTFLoader).load("./free_car_001.gltf");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
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

      setTimeout(() => {
        tweenCameraPosition("add");
      }, 200);
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

  function handleVideoEnded() {
    videoEnded = true;
    videoReady = false;
  }
</script>

<div class="{currentMode ? 'sceneLight' : 'sceneDark'} absolute z-0">
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

<div class="h-screen">
  {#if videoReady}
    <div
      transition:fade={{ delay: 250, duration: 300 }}
      class="relative mx-auto w-full rounded-md">
      <video
        src="LightHomePageVid.mp4"
        muted
        autoplay
        playsinline
        on:ended={handleVideoEnded}
        class="{isMobile ? 'hidden' : ''} {!currentMode
          ? 'z-low'
          : 'z-high'} absolute">
        Your browser does not support the video tag.
      </video>
      <video
        src="DarkHomePageVid.mp4"
        muted
        autoplay
        playsinline
        class="{isMobile ? 'hidden' : ''} {!currentMode
          ? 'z-high'
          : 'z-low'} absolute">
        Your browser does not support the video tag.
      </video>
    </div>
  {/if}
  <div
    class="relative flex h-5/6 flex-col items-center justify-center space-y-6">
    {#if videoEnded}
      <div
        transition:fade={{ delay: 250, duration: 300 }}
        class="text-center text-7xl font-extrabold">
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
</div>

<div class="card fixed left-0 top-0 z-30 p-4">{$scrollPosition}</div>

<div class="card relative my-4 space-y-4 p-4">
  <div id="sectionOne" class="card p-4">
    <div
      class="relative my-4 grid grid-cols-2 items-center justify-center gap-4 space-y-6 p-40"
      transition:slide={{
        delay: 250,
        duration: 300,
        easing: quintOut,
        axis: "x",
      }}>
      <div class="card col-span-1">
        <a href="/browse-vehicles">
          <img class="rounded-t-lg" src="/car1hp.jpg" alt="" />
        </a>
        <header class="card-header">
          <p class="h2">View our catalog of vehicles</p>
        </header>
        <section class="p-4">
          Explore our wide range of available vehicles for rental. From compact
          cars to luxury SUVs, we have something for everyone.
        </section>
        <footer class="card-footer">
          <button
            class="btn mx-auto block bg-primary-500"
            on:click={() => {
              window.location.href = "/browse-vehicles";
            }}>Browse Vehicles</button>
        </footer>
      </div>
      <div class="card col-span-1 p-4">Test</div>
    </div>
  </div>
  <div id="sectionTwo" class="card p-4">
    <div
      class="relative my-4 grid grid-cols-2 items-center justify-center gap-4 space-y-6 p-40"
      transition:slide={{
        delay: 250,
        duration: 300,
        easing: quintOut,
        axis: "x",
      }}>
      <div class="card col-span-1 p-4">Test</div>
      <div class="card col-span-1">
        <a href="/browse-vehicles">
          <img class="rounded-t-lg" src="/car1hp.jpg" alt="" />
        </a>
        <header class="card-header">
          <p class="h2">View our catalog of vehicles</p>
        </header>
        <section class="p-4">
          Explore our wide range of available vehicles for rental. From compact
          cars to luxury SUVs, we have something for everyone.
        </section>
      </div>
    </div>
  </div>
  <div id="sectionThree" class="card p-4">
    <div
      class="relative my-4 grid grid-cols-2 items-center justify-center gap-4 space-y-6 p-40"
      transition:slide={{
        delay: 250,
        duration: 300,
        easing: quintOut,
        axis: "x",
      }}>
      <div class="card col-span-1">
        <a href="/browse-vehicles">
          <img class="rounded-t-lg" src="/car1hp.jpg" alt="" />
        </a>
        <header class="card-header">
          <p class="h2">View our catalog of vehicles</p>
        </header>
        <section class="p-4">
          Explore our wide range of available vehicles for rental. From compact
          cars to luxury SUVs, we have something for everyone.
        </section>
      </div>
      <div class="card col-span-1 p-4">Test</div>
    </div>
  </div>
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
</style>
