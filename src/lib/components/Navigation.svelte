<script lang="ts">
  import { page } from "$app/stores";
  import CarIcon from "$lib/icons/CarIcon.svelte";
  import HomeIcon from "$lib/icons/HomeIcon.svelte";
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  const links = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Browse Vehicles", href: "/browse-vehicles", icon: CarIcon },
  ];

  $: selected = $page.url.pathname;
  const drawerStore = getDrawerStore();

  function drawerClose() {
    drawerStore.close();
  }
</script>

<nav class="list-nav p-4">
  <ul>
    {#each links as link (link.name)}
      <li>
        <a
          class={selected === link.href ? "variant-filled-primary" : ""}
          href={link.href}
          on:click={drawerClose}
          ><svelte:component this={link.icon} /><span>{link.name}</span></a>
      </li>
    {/each}
  </ul>
</nav>
