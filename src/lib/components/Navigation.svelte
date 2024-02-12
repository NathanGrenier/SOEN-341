<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  const drawerStore = getDrawerStore();

  function drawerClose() {
    drawerStore.close();
  }
</script>

<nav class="list-nav p-4">
  <ul>
    {#each links as link (link.name)}
      <li><a href={link.href} on:click={drawerClose}>{link.name}</a></li>
    {/each}
  </ul>
</nav>
