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
      With every spin, you stand a chance to unlock exclusive offers!
      <br />
      <br />
      How to play:
      <br />
      Click on "Spin the Wheel! And then choose 1 icon to spin the wheel."
      <br />
      If the wheel lands on the matching icon that you selected, then you win a discount
      code! Simply enter the code at checkout to apply your discount!
      <br />
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
        class="ml-auto dark:text-tertiary-500" />
    </div>
    <Wheel />
  </Drawer>
</div>

<style>
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 1rem;
  }

  .drawer-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    height: auto;
    z-index: 1000;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    display: flex;
  }

  .button-wrapper {
    display: flex;
    justify-content: left;
    padding: 2rem 0;
  }

  :global(.button-wrapper button) {
    background-color: #ffdd22;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 18px;
  }
</style>
