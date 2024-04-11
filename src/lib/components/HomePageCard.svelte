<script lang="ts">
  import type { HomePageCardType } from "../../routes/+page.svelte";
  export let card: HomePageCardType;
  export let isVisible: boolean;
</script>

<div
  id={`section${card.section}`}
  data-section={card.section}
  class="section-card fade-transition {isVisible ? 'visible' : ''}">
  <a
    href={card.href}
    class="relative my-4 grid grid-cols-2 items-center justify-center gap-4 space-y-6 p-40">
    {#if card.section % 2 === 0}
      <div class="col-span-1">
        <img
          src={card.previewImage}
          alt=""
          class="img card-hover flex justify-center rounded-md align-middle" />
      </div>
      <div class="card card-hover col-span-1">
        <img class="rounded-t-lg" src={card.image} alt={card.title} />
        <header class="card-header">
          <p class="h2">{card.title}</p>
        </header>
        <section class="p-4">
          {card.description}
        </section>
        <footer class="card-footer flex justify-center">
          <a href={card.href} class="btn bg-primary-500">{card.buttonText}</a>
        </footer>
      </div>
    {:else}
      <div class="card card-hover col-span-1">
        <img class="rounded-t-lg" src={card.image} alt={card.title} />
        <header class="card-header">
          <p class="h2">{card.title}</p>
        </header>
        <section class="p-4">
          {card.description}
        </section>
        <footer class="card-footer flex justify-center">
          <a href={card.href} class="btn bg-primary-500">{card.buttonText}</a>
        </footer>
      </div>
      <div class="col-span-1">
        <img
          src={card.previewImage}
          alt=""
          class="img card-hover flex justify-center rounded-md align-middle" />
      </div>
    {/if}
  </a>
</div>

<style>
  .fade-transition {
    transition:
      opacity 1.25s ease,
      transform 0.5s;
    opacity: 0;
    transform: translateY(20px);
  }

  .fade-transition.visible {
    opacity: 1;
  }
</style>
