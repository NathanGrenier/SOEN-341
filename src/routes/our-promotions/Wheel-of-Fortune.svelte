<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let winAmount = 50;
  let loseAmount = 50;
  let deg = 0;
  let zoneSize = 45; // deg
  let rolling = false;
  // Counter clockwise
  const symbolSegments = {
    1: "Frog",
    2: "Snail",
    3: "Dolphin",
    4: "Ladybug",
    5: "Koala",
    6: "Unicorn",
    7: "Dragon",
    8: "Snowman",
  };

  onMount(() => {
    const wheel = document.getElementById("wheel");
    const startButton = document.getElementById("button");
    const display = document.getElementById("display");

    const frog = document.getElementById("frog");
    const snail = document.getElementById("snail");
    const dolphin = document.getElementById("dolphin");
    const ladybug = document.getElementById("ladybug");
    const koala = document.getElementById("koala");
    const unicorn = document.getElementById("unicorn");
    const dragon = document.getElementById("dragon");
    const snowman = document.getElementById("snowman");

    frog.addEventListener("click", () => onClick(display, wheel, "Frog"));
    snail.addEventListener("click", () => onClick(display, wheel, "Snail"));
    dolphin.addEventListener("click", () => onClick(display, wheel, "Dolphin"));
    ladybug.addEventListener("click", () => onClick(display, wheel, "Ladybug"));
    koala.addEventListener("click", () => onClick(display, wheel, "Koala"));
    unicorn.addEventListener("click", () => onClick(display, wheel, "Unicorn"));
    dragon.addEventListener("click", () => onClick(display, wheel, "Dragon"));
    snowman.addEventListener("click", () => onClick(display, wheel, "Snowman"));

    wheel.addEventListener("transitionend", () => {
      // Need to set transition to none as we want to rotate instantly
      wheel.style.transition = "none";
      // Calculate degree on a 360 degree basis to get the "natural" real rotation
      // Important because we want to start the next spin from that one
      // Use modulus to get the rest value
      const actualDeg = deg % 360;
      // Set the real rotation instantly without animation
      wheel.style.transform = `rotate(${actualDeg}deg)`;
      // Calculate and display the winning symbol
      handleWin(actualDeg);
    });
  });

  const handleWin = (actualDeg) => {
    const winningSymbolNr = Math.ceil(actualDeg / zoneSize);
    if (display.innerHTML === symbolSegments[winningSymbolNr]) {
      display.innerHTML = `+${winAmount}`;
      dispatch("win", { amount: winAmount });
    } else {
      display.innerHTML = `-${loseAmount}`;
      dispatch("lose", { amount: loseAmount });
    }
    rolling = false;
  };

  function onClick(display, wheel, button) {
    rolling = true;
    display.innerHTML = button;
    deg = Math.floor(5000 + Math.random() * 5000);
    wheel.style.transition = "all 5s ease-out";
    wheel.style.transform = `rotate(${deg}deg)`;
  }
</script>

/* eslint-disable */

<main transition>
  <div id="app">
    <img
      id="marker"
      alt=""
      src="https://raw.githubusercontent.com/weibenfalk/wheel-of-fortune-part2/main/vanilla-js-wheel-of-fortune-part2-FINISHED/marker.png" />
    <img id="wheel" alt="" src="/wheel.png" />
    <div id="display">-</div>
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="frog"
        disabled={rolling}>
        🏎️
      </button>
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} border-b border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="snail"
        disabled={rolling}>
        🚀
      </button>
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="dolphin"
        disabled={rolling}>
        🚗
      </button>
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="ladybug"
        disabled={rolling}>
        🚕
      </button>
    </div>
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="koala"
        disabled={rolling}>
        🚐
      </button>
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="unicorn"
        disabled={rolling}>
        🛥️
      </button>
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="dragon"
        disabled={rolling}>
        🚜
      </button>
      <button
        type="button"
        class="{rolling
          ? 'cursor-not-allowed'
          : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        id="snowman"
        disabled={rolling}>
        🚒
      </button>
    </div>
  </div>
</main>

<style>
  #app {
    width: 400px;
    height: 400px;
    margin: 0 auto;
    position: relative;
  }

  #display {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 50px;
    border: 1px solid black;
    border-radius: 20px;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 2rem;
    margin: 20px auto;
  }

  #marker {
    position: absolute;
    width: 60px;
    left: 172px;
    top: -20px;
    z-index: 2;
  }

  #wheel {
    width: 100%;
    height: 100%;
  }
</style>
