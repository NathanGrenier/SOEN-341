<script>
  import { Drawer, Button, CloseButton } from "flowbite-svelte";
  import { InfoCircleSolid, ArrowRightOutline } from "flowbite-svelte-icons";
  import { sineIn } from "svelte/easing";
  let hidden1 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };
</script>

<div class="text-center">
  <Button on:click={() => (hidden1 = false)}>Show drawer</Button>
</div>

<Drawer
  transitionType="fly"
  {transitionParams}
  bind:hidden={hidden1}
  id="sidebar1">
  <div class="flex items-center">
    <h5
      id="drawer-label"
      class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400">
      <InfoCircleSolid class="me-2.5 h-4 w-4" />Info
    </h5>
    <CloseButton
      on:click={() => (hidden1 = true)}
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
