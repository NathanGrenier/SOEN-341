<script lang="ts">
  import "../app.postcss";
  import { dev } from "$app/environment";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { page } from "$app/stores";
  import { inject } from "@vercel/analytics";
  inject({ mode: dev ? "development" : "production" });

  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";

  import {
    initializeStores,
    AppShell,
    AppBar,
    Avatar,
    Drawer,
    getDrawerStore,
    Toast,
    LightSwitch,
    Modal,
    popup,
    storePopup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import ModalComponentTest from "$lib/components/modals/ModalComponentTest.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import HamburgerMenuIcon from "$lib/icons/HamburgerMenuIcon.svelte";
  import ProfilePopup from "$lib/components/ProfilePopup.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();

  export let data;

  // Add custom modals to this registry. They can then be triggered by name elsewhere.
  const modalRegistry = {
    modalComponentTest: { ref: ModalComponentTest },
  };

  const drawerStore = getDrawerStore();

  function drawerOpen() {
    drawerStore.open();
  }

  const profilePopup: PopupSettings = {
    event: "click",
    target: "profilePopup",
    placement: "bottom",
  };
</script>

<Toast position="br" />

<Modal components={modalRegistry} />

<Drawer>
  <Navigation />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <button class="btn btn-sm mr-4 md:hidden" on:click={drawerOpen}>
          <span>
            <HamburgerMenuIcon />
          </span>
        </button>
        <strong class="text-xl uppercase">App Name</strong></svelte:fragment>
      <svelte:fragment slot="trail">
        <LightSwitch class="mr-2" />
        <div use:popup={profilePopup}>
          <!-- No good way to ignore this? sveltejs/language-tools#1026 -->
          <Avatar
            initials={data.user
              ? data.user.name
                  .match(/(\b\S)?/g)
                  .join("")
                  .match(/(^\S|\S$)?/g)
                  .join("")
              : "?"}
            background="bg-tertiary-500"
            width="w-12"
            border="border-4 border-surface-300-600-token hover:!border-primary-500"
            cursor="cursor-pointer" />
        </div>
        <ProfilePopup loggedIn={data.user ? true : false} />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>
  <!-- (sidebarRight) -->
  <!-- (pageHeader) -->
  <!-- Router Slot -->
  <div class="container mx-auto p-10">
    <slot />
  </div>
  <!-- ---- / ---- -->
  <!-- (pageFooter) -->
  <!-- (footer) -->
</AppShell>
