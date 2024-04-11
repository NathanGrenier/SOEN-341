<script lang="ts" context="module">
  export type HomePageCardType = {
    section: number;
    href: string;
    title: string;
    description: string;
    buttonText: string;
    image: string;
    previewImage: string;
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  import { Canvas } from "@threlte/core";
  import { modeCurrent } from "@skeletonlabs/skeleton";
  import { T } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import type { TypedArray } from "three";
  import { tweened } from "svelte/motion";
  import { linear } from "svelte/easing";
  import { fade } from "svelte/transition";
  import DownArrowIcon from "$lib/icons/DownArrowIcon.svelte";
  import { browser } from "$app/environment";
  import HomePageCard from "$lib/components/HomePageCard.svelte";
  import UpArrowIcon from "$lib/icons/UpArrowIcon.svelte";

  function inSphere(array: Float32Array, radius: number) {
    const numPoints = array.length / 3;

    for (let i = 0; i < numPoints; i++) {
      const u = Math.random();
      const v = Math.random();

      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const r = Math.cbrt(Math.random());
      const x = radius * r * Math.sin(phi) * Math.cos(theta);
      const y = radius * r * Math.sin(phi) * Math.sin(theta);
      const z = radius * r * Math.cos(phi);

      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }

    return array;
  }

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
  let videoReady = false;
  let mouseMove = false;
  let videoEnded = false;
  let isMobile = false;

  $: sectionVisibility = 0;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            sectionVisibility = Number(element.dataset.section);
          }
        });
      },
      { threshold: 0.5 },
    );

    document.querySelectorAll(".section-card").forEach((section) => {
      const element = section as HTMLElement;
      observer.observe(element);
    });

    sphere = inSphere(new Float32Array(5000), 1.2);

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

    return () => {
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

  $: sectionVisibility;

  const incrementSectionNumber = () => {
    if (sectionVisibility === 3) {
      sectionVisibility = 0;
      tweenCameraPosition("remove");
    } else {
      sectionVisibility = sectionVisibility + 1;
      tweenCameraPosition("add");
    }
  };

  const scrollToSection = () => {
    if (!browser) return;
    incrementSectionNumber();
    const section = document.getElementById(`section${sectionVisibility}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  function tweenCameraPosition(operation: string) {
    if (operation === "remove")
      tweenedXPosition.update((prev) => {
        return prev - 2.5;
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

  const homePageCards: HomePageCardType[] = [
    {
      section: 1,
      href: "/browse-vehicles",
      title: "View Our Vehicle Catalog",
      description:
        "Explore our wide range of available vehicles for rental. From compact cars to luxury SUVs, we have something for everyone.",
      buttonText: "Browse Vehicles",
      image: "/car1hp.jpg",
      previewImage: "/browse-vehicles.png",
    },
    {
      section: 2,
      href: "/find-branch",
      title: "Find a Branch Near You",
      description:
        "Locate our branches conveniently located across the city. We're always nearby to provide you with the best car rental experience.",
      buttonText: "Find a Branch",
      image: "/car2hp.jpg",
      previewImage: "/find-a-branch.png",
    },
    {
      section: 3,
      href: "/our-promotions",
      title: "View Our Roulette",
      description:
        "Explore our wide range of available vehicles for rental. From compact cars to luxury SUVs, we have something for everyone.",
      buttonText: "Spin the Wheel",
      image: "/car3hp.jpg",
      previewImage: "/roulette.png",
    },
  ];
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
  </Canvas>
</div>

<div class="section-card h-screen" id="section0" data-section="0">
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
          : 'z-high'} absolute top-[-3rem] w-screen">
        Your browser does not support the video tag.
      </video>
      <video
        src="DarkHomePageVid.mp4"
        muted
        autoplay
        playsinline
        class="{isMobile ? 'hidden' : ''} {!currentMode
          ? 'z-high'
          : 'z-low'} absolute top-[-3rem] w-screen">
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
        on:click={scrollToSection}
        transition:fade={{ delay: 250, duration: 300 }}
        class="variant-filled-primary btn mx-auto block">Begin</button>
    {/if}
  </div>
</div>

<div class="relative my-4 space-y-4 p-4">
  {#each homePageCards as card}
    <HomePageCard {card} isVisible={sectionVisibility === card.section} />
  {/each}
</div>

<div class="absolute-center bottom-button bottom-0">
  <button
    class="{sectionVisibility === 0
      ? 'hidden'
      : ''} btn z-50 rounded bg-primary-500 px-3 py-2 font-bold"
    on:click={() => {
      scrollToSection();
    }}>
    {#if sectionVisibility === homePageCards.length}
      <UpArrowIcon />
    {:else}
      <DownArrowIcon />
    {/if}
  </button>
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

  .section-card {
    opacity: 1;
    transform: translateY(20px);
    transition:
      opacity 2.5s,
      transform 0.5s;
  }

  .absolute-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .bottom-button {
    bottom: 20px;
  }
</style>
