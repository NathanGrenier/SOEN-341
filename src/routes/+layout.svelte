<script lang="ts" context="module">
  import type { LayoutData } from "./$types";

  export type User = LayoutData["user"];
</script>

<script lang="ts">
  import "../app.postcss";
  import { dev } from "$app/environment";
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
    TabGroup,
    TabAnchor,
  } from "@skeletonlabs/skeleton";
  import ModalComponentTest from "$lib/components/modals/ModalComponentTest.svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import HamburgerMenuIcon from "$lib/icons/HamburgerMenuIcon.svelte";
  // import ProfilePopup from "$lib/components/ProfilePopup.svelte";
  import { page } from "$app/stores";
  import CarIcon from "$lib/icons/CarIcon.svelte";
  import HomeIcon from "$lib/icons/HomeIcon.svelte";
  import UserIcon from "$lib/icons/UserIcon.svelte";
  import GridIcon from "$lib/icons/GridIcon.svelte";
  import GridPlusIcon from "$lib/icons/GridPlusIcon.svelte";
  import { UserRole } from "@prisma/client";
  import UserSettingsIcon from "$lib/icons/UserSettingsIcon.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();

  export let data;

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

  const initials =
    data?.user?.name
      .match(/(\b\S)?/g)
      ?.join("")
      ?.match(/(^\S|\S$)?/g)
      ?.join("") ?? "?";
</script>

<Toast position="br" />

<Modal components={modalRegistry} />

<Drawer>
  <Navigation />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10" class="bg-light-100">
  <svelte:fragment slot="header">
    <AppBar padding="py-0 px-4" slotDefault="h-fit">
      <svelte:fragment slot="lead">
        <button class="btn btn-sm mr-4 md:hidden" on:click={drawerOpen}>
          <HamburgerMenuIcon />
        </button>
        <img src="SiteLogoFor.png" alt="DriveXperience" class="h-20" />
      </svelte:fragment>
      <TabGroup
        justify="justify-center"
        active="variant-filled-primary"
        hover="hover:variant-soft-primary"
        flex="flex-1 lg:flex-none justify-center"
        rounded=""
        border=""
        class="bg-surface-100-800-token h-full">
        <TabAnchor
          flex="flex flex-col align-middle justify-center"
          href="/"
          selected={$page.url.pathname === "/"}>
          <svelte:fragment slot="lead"
            ><div class="flex justify-center">
              <HomeIcon />
            </div></svelte:fragment>
          <span>Home</span>
        </TabAnchor>
        <TabAnchor
          href="/browse-vehicles"
          selected={$page.url.pathname === "/browse-vehicles"}>
          <svelte:fragment slot="lead"
            ><div class="flex justify-center">
              <CarIcon />
            </div></svelte:fragment>
          <span>Browse Vehicles</span>
        </TabAnchor>
      </TabGroup>
      <svelte:fragment slot="trail">
        <LightSwitch class="mr-2" />
        <div use:popup={profilePopup}>
          <Avatar
            {initials}
            background="bg-tertiary-500"
            width="w-12"
            border="border-4 border-surface-300-600-token hover:!border-primary-500"
            cursor="cursor-pointer" />
        </div>
        <div
          style="margin: 1px"
          class="card variant-filled w-auto p-4 shadow-xl"
          data-popup="profilePopup">
          <div class="variant-filled arrow" />

          {#if data.user}
            <div class=" variant-filled btn-group-vertical w-full">
              <!-- TODO: Un-disable the button when the profile page is implemented -->
              <button
                style="justify-content: start;"
                class=" bg-secondary-hover-token gap-2"
                disabled={true}
                ><UserIcon invertColor={true} /><span>Profile</span></button>
              <a
                href="/dashboard"
                style="justify-content: start;"
                class=" bg-secondary-hover-token gap-2"
                ><GridIcon invertColor={true} /><span>Dashboard</span></a>
              {#if data.user?.role === UserRole.ADMIN}
                <a
                  href="/admin"
                  style="justify-content: start;"
                  class=" bg-secondary-hover-token gap-2"
                  ><GridPlusIcon invertColor={true} /><span
                    >Admin Dashboard</span
                  ></a>
              {/if}
              <!-- TODO: Un-disable the button when the settings page is implemented -->
              <button
                style="justify-content: start;"
                class="bg-secondary-hover-token gap-2"
                disabled={true}
                ><UserSettingsIcon invertColor={true} /><span>Settings</span
                ></button>
            </div>
            <div>
              <a
                class="variant-filled-error btn mt-2 w-full"
                href="/auth/logout"
                data-sveltekit-reload>Log Out</a>
            </div>
          {:else}
            <div>
              <a
                class="variant-filled-primary btn mt-2 w-full"
                href="/auth/login">Log In</a>
              <a
                class="variant-filled-secondary btn mt-2 w-full"
                href="/auth/register">Create Account</a>
            </div>
          {/if}
          <!-- <ProfilePopup user={data.user} /> -->
        </div>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <div class="container mx-auto p-10">
    <slot />
  </div>

  <svelte:fragment slot="pageFooter">
    <!-- <footer
      class="text-white p-4 text-center"
      style="background-color: var(--color-surface-800);">
      <a href="/contact" class="p-2">Contact Us</a>
      <a href="/account" class="p-2">My Account</a>
      <a href="/help" class="p-2">Help</a>
      <a href="/policies" class="p-2">Our Policies</a>
    </footer> -->
  </svelte:fragment>
</AppShell>
