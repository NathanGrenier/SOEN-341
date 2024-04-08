<script lang="ts">
  import { Drawer, Button, CloseButton } from "flowbite-svelte";
  import Wheel from "./Wheel-of-Fortune.svelte";

  let hidden1 = true;

  function toggleDrawer() {
    hidden1 = !hidden1;
  }
</script>

<div class="container mx-auto py-10">
  <h1 class="mb-6 text-3xl font-bold">Exclusive Promotions</h1>

  <section>
    <h2 class="mb-4 text-2xl font-bold">Your Chance to Win Big!</h2>
    <p class="mb-4 text-lg">
      Introducing our Spin-the-Wheel feature! A fun and engaging way for you to
      win amazing prizes and discounts.
      <br />
      With every spin, you stand a chance to unlock exclusive offers, including:
      <br />
      <br />
      - Hefty discounts on our premium driving experiences
      <br />
      - Complimentary upgrades on rentals
      <br />
      - Special giveaways and much more!
      <br />
      <br />
      All you need to do is click on the "Spin the Wheel" button to reveal our interactive
      wheel within the drawer.
      <br />
      Take a spin and let fortune decide the special offer you'll receive. It's our
      way of saying thank you for choosing DriveXperience, where every journey is
      an adventure.
    </p>
    <div class="button-wrapper">
      <Button on:click={toggleDrawer}>Spin the Wheel!</Button>
    </div>
  </section>
</div>

<div class="drawer-container">
  <Drawer transitionType="fly" bind:hidden={hidden1} id="sidebar1">
    <div class="drawer-header">
      <h5 class="text-base font-semibold">Spin the Wheel!</h5>
      <CloseButton
        on:click={() => (hidden1 = true)}
        class="ml-auto dark:text-white" />
    </div>
    <Wheel />
  </Drawer>
</div>

<style>
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 1rem; /* Adjust based on your design */
  }

  .drawer-container {
    position: fixed; /* or absolute, depending on your layout */
    left: 50%;
    top: 20%;
    transform: translate(-50%, -50%);
    width: 100%; /* This controls the width, ensuring padding on the sides */
    max-width: 1200px; /* Adjust max-width as necessary */
    height: auto; /* Adjust based on content or set a specific height */
    z-index: 1000; /* Ensure it's above other content */
  }

  .button-wrapper {
    display: flex;
    justify-content: center;
    padding: 2rem 0; /* Adjust spacing above and below the button */
  }

  :global(.button-wrapper button) {
    background-color: #ffdd22; /* Yellow background */
    color: #333; /* Dark text color */
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
    /* Add more styling as needed */
  }
</style>
