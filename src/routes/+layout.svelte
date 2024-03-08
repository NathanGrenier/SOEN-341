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

  // Get the user's initials for the avatar. Takes the first letter of the first and last word in the name.
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

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <button class="btn btn-sm mr-4 md:hidden" on:click={drawerOpen}>
          <span>
            <HamburgerMenuIcon />
          </span>
        </button>
        <img src="SiteLogoFor.png" alt="DriveXperience" class="h-20" />
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <LightSwitch class="mr-2" />
        <div use:popup={profilePopup}>
          <!-- No good way to ignore this? sveltejs/language-tools#1026 -->
          <Avatar
            {initials}
            background="bg-tertiary-500"
            width="w-12"
            border="border-4 border-surface-300-600-token hover:!border-primary-500"
            cursor="cursor-pointer" />
        </div>
        <ProfilePopup loggedIn={data.user ? true : false} />
      </svelte:fragment>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/browse-vehicles">Browse Vehicles</a>
          </li>
          <li>
            <a href="/">Placeholder</a>
          </li>
          <li>
            <a href="/">Placeholder</a>
          </li>
          <li>
            <a href="/">Contact</a>
          </li>
          <li>
            <a href="/account" class="account-button">Account</a>
          </li>
        </ul>
      </nav>
    </AppBar>
  </svelte:fragment>

  <!-- (sidebarRight) -->
  <!-- (pageHeader) -->
  <!-- Router Slot -->
  <div class="container mx-auto p-10">
    <!-- Your Video Embed Here -->
    <div class="text-center">
      <!-- Full Bleed Video Setup -->
      <video src="HomePageVid.mp4" autoplay muted class="full-bleed-video">
        Your browser does not support the video tag.
      </video>
    </div>
    <!-- Keep the <slot /> if you still want to inject other content into this container -->
    <slot />
  </div>
  <!-- ---- / ---- -->
  <!-- (pageFooter) -->
  <!-- (footer) -->
</AppShell>

<style>
  /* Existing styles */
  nav {
    display: flex;
  }

  ul {
    display: flex;
    margin: 0;
    margin-left: auto;
    list-style: none;
  }

  li {
    margin-right: 20px;
  }

  nav ul li a {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #08417a;
    color: #fff;
    text-decoration: none;
  }

  nav ul li a:hover {
    background-color: #08417a;
  }

  /* Full Bleed Video Styles */
  .full-bleed-video {
    position: fixed; /* or 'absolute', depending on your layout needs */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover; /* Covers the full viewport without losing aspect ratio */
    z-index: -1; /* Sit behind other content; adjust as necessary */
  }
</style>
