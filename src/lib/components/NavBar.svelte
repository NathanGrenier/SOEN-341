<script lang="ts">
  import CarIcon from "$lib/icons/CarIcon.svelte";
  import HomeIcon from "$lib/icons/HomeIcon.svelte";
  import { TabAnchor, TabGroup } from "@skeletonlabs/skeleton";

  import { page } from "$app/stores";
  import GridIcon from "$lib/icons/GridIcon.svelte";
  import GridPlusIcon from "$lib/icons/GridPlusIcon.svelte";

  const links = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Browse Vehicles", href: "/browse-vehicles", icon: CarIcon },
    // TODO: Dashboard and Admin Dashboard are temporary links (until the avatar popup works again)
    { name: "Dashboard", href: "/dashboard", icon: GridIcon },
    { name: "Admin Dashboard", href: "/admin", icon: GridPlusIcon },
  ];
</script>

<TabGroup
  justify="justify-center"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  flex="flex-1 lg:flex-none justify-center"
  rounded=""
  border=""
  class="bg-surface-100-800-token hidden h-full md:block ">
  {#each links as link (link.name)}
    <TabAnchor href={link.href} selected={$page.url.pathname === link.href}>
      <svelte:fragment slot="lead"
        ><div class="flex justify-center">
          <svelte:component this={link.icon} />
        </div></svelte:fragment>
      <span>{link.name}</span>
    </TabAnchor>
  {/each}
</TabGroup>
