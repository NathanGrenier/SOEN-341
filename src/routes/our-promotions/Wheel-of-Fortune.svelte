<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let deg = 0;
  let zoneSize = 45;
  let rolling = false;

  const symbolSegments = {
    1: "RaceCar",
    2: "Rocket",
    3: "RedCar",
    4: "Taxi",
    5: "Van",
    6: "Boats",
    7: "Tractor",
    8: "FireTruck",
  };

  const symbolWinAmounts = {
    RaceCar: "SAVENOW10",
    Rocket: "SAVENOW10",
    RedCar: "SAVENOW10",
    Taxi: "HALFOFF",
    Van: "HALFOFF",
    Boats: "THIRTYOFF",
    Tractor: "THIRTYOFF",
    FireTruck: "THIRTYOFF",
  };

  onMount(() => {
    const wheel = document.getElementById("wheel");
    const startButton = document.getElementById("button");
    const display = document.getElementById("display");

    const RaceCar = document.getElementById("RaceCar");
    const Rocket = document.getElementById("Rocket");
    const RedCar = document.getElementById("RedCar");
    const Taxi = document.getElementById("Taxi");
    const Van = document.getElementById("Van");
    const Boats = document.getElementById("Boats");
    const Tractor = document.getElementById("Tractor");
    const FireTruck = document.getElementById("FireTruck");

    RaceCar.addEventListener("click", () => onClick(display, wheel, "RaceCar"));
    Rocket.addEventListener("click", () => onClick(display, wheel, "Rocket"));
    RedCar.addEventListener("click", () => onClick(display, wheel, "RedCar"));
    Taxi.addEventListener("click", () => onClick(display, wheel, "Taxi"));
    Van.addEventListener("click", () => onClick(display, wheel, "Van"));
    Boats.addEventListener("click", () => onClick(display, wheel, "Boats"));
    Tractor.addEventListener("click", () => onClick(display, wheel, "Tractor"));
    FireTruck.addEventListener("click", () =>
      onClick(display, wheel, "FireTruck"),
    );

    wheel.addEventListener("transitionend", () => {
      wheel.style.transition = "none";
      const actualDeg = deg % 360;
      // Include both translate and rotate in the transform property
      wheel.style.transform = `translate(-50%, -50%) rotate(${actualDeg}deg)`;
      handleWin(actualDeg);
    });
  });

  const handleWin = (actualDeg) => {
    const winningSymbolNr = Math.ceil(actualDeg / zoneSize);
    const winningSymbol = symbolSegments[winningSymbolNr];
    if (display.innerHTML === winningSymbol) {
      const winAmount = symbolWinAmounts[winningSymbol];
      display.innerHTML = `+${winAmount}`;
      dispatch("win", { amount: winAmount });
    } else {
      // Adjust according to how you want to handle losses
      display.innerHTML = "Better luck next time!";
      dispatch("lose");
    }
    rolling = false;
  };

  function onClick(display, wheel, button) {
    rolling = true;
    display.innerHTML = button;
    deg = Math.floor(5000 + Math.random() * 5000);
    // Include both translate and rotate in the transform property
    wheel.style.transition = "all 5s ease-out";
    wheel.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
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
    <div id="display" class="text-tertiary-500">-</div>
    <div class="buttons-container">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          class="{rolling
            ? 'cursor-not-allowed'
            : ''} rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          id="RaceCar"
          disabled={rolling}>
          🏎️
        </button>
        <button
          type="button"
          class="{rolling
            ? 'cursor-not-allowed'
            : ''} border-b border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          id="Rocket"
          disabled={rolling}>
          🚀
        </button>
        <button
          type="button"
          class="{rolling
            ? 'cursor-not-allowed'
            : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          id="RedCar"
          disabled={rolling}>
          🚗
        </button>
        <button
          type="button"
          class="{rolling
            ? 'cursor-not-allowed'
            : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          id="Taxi"
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
          id="Van"
          disabled={rolling}>
          🚐
        </button>
        <button
          type="button"
          class="{rolling
            ? 'cursor-not-allowed'
            : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          id="Boats"
          disabled={rolling}>
          🛥️
        </button>
        <button
          type="button"
          class="{rolling
            ? 'cursor-not-allowed'
            : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          id="Tractor"
          disabled={rolling}>
          🚜
        </button>
        <button
          type="button"
          class="{rolling
            ? 'cursor-not-allowed'
            : ''} rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          id="FireTruck"
          disabled={rolling}>
          🚒
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  #app {
    width: 600px;
    height: 600px;
    margin: 0 auto;
    position: relative;
  }

  #wheel {
    width: 400px;
    height: 400px;
    margin: auto;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    transform-origin: 50% 50%;
  }

  .buttons-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-top: 450px;
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
    position: absolute; /* Make the position absolute to position it within #app */
    left: 50%; /* Center horizontally */
    transform: translateX(
      -50%
    ); /* Center it horizontally with respect to its width */
    top: 375px; /* Adjust this value to move the box down as needed */
    color: "bg-tertiary-500";
  }

  #marker {
    position: absolute;
    width: 60px;
    left: 270px;
    top: -70px;
    z-index: 2;
  }

  .inline-flex button {
    padding: 8px 8px;
    font-size: 1.5rem;
  }
</style>
