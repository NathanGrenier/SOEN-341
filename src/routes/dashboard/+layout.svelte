<script lang="ts" context="module">
  import type { SvelteComponent } from "svelte";

  export type BreadcrumLink = {
    name: string;
    identifier: string;
    title: string;
    href: string;
    icon: typeof SvelteComponent;
  };
</script>

<script lang="ts">
  import CarIcon from "$lib/icons/CarIcon.svelte";
  import GridIcon from "$lib/icons/GridIcon.svelte";
  import { page } from "$app/stores";

  $: routes = $page.url.pathname.split("/").slice(1);

  type SvelteComponent = typeof import("svelte").SvelteComponent;

  const links: BreadcrumLink[] = [
    {
      name: "Dashboard",
      identifier: "dashboard",
      title: "Go to dashboard",
      href: "/dashboard",
      icon: GridIcon as SvelteComponent,
    },
    {
      name: "Current Reservation",
      identifier: "reservation",
      title: "Current Reservation",
      href: `/dashboard/reservation-${$page.url.pathname.match(/reservation-(\d+)/)?.[1]}`,
      icon: CarIcon as SvelteComponent,
    },
  ];
</script>

<div class="flex flex-col gap-2">
  <div class="card w-fit p-2">
    <ol class="breadcrumb">
      {#each links as link (link.identifier)}
        {#if routes.some((route) => route.includes(link.identifier))}
          <li class="crumb">
            <a class="anchor flex gap-2" href={link.href} title={link.title}>
              <svelte:component this={link.icon} />
              <span>{link.name}</span>
            </a>
          </li>
          {#if !routes[routes.length - 1].includes(link.identifier)}
            <li class="crumb-separator" aria-hidden>&rsaquo;</li>
          {/if}
        {/if}
      {/each}
    </ol>
  </div>
  <slot />
</div>
