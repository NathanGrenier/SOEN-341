<script lang="ts">
  export let data;

  let filteredColor = "";
  let filteredPrice = 0;

  const cars = data.props.cars;

  function showPopup(index: number) {
    const popup = document.getElementById(`popupCard_${index}`);
    if (popup) {
      popup.style.display = "block";
    }
  }

  function closePopup(index: number) {
    const popup = document.getElementById(`popupCard_${index}`);
    if (popup) {
      popup.style.display = "none";
    }
  }
</script>

<div class="filter-container">
  <select bind:value={filteredColor}>
    <option value="">All Colors</option>
    {#each Array.from(new Set(cars.map((car) => car.colour))) as color}
      <option value={color}>{color}</option>
    {/each}
  </select>

  <input
    type="range"
    min="0"
    max="2000"
    step="1"
    bind:value={filteredPrice}
    class="price-slider" />
  <span class="price-display">${filteredPrice}</span>
</div>

<div class="car-container">
  {#each cars as car, index}
    {#if (!filteredColor || car.colour === filteredColor) && (!filteredPrice || car.dailyPrice <= filteredPrice)}
      <div class="car">
        <div class="car-inner">
          <!-- <img src={car.photoUrl} alt={car.make} /> -->
          <img src={"link"} alt={"image of a car"} />
          <h2>{car.model}</h2>
          <p>{car.description}</p>
          <button
            on:click={() => showPopup(index)}
            class="cursor-pointer rounded-lg border-b-[4px] border-blue-600 bg-blue-500 px-6 py-2 text-white transition-all hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] active:brightness-90">
            Button
          </button>
        </div>
      </div>
      <div id={`popupCard_${index}`} class="popupCard" style="display: none;">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class="closeButton" on:click={() => closePopup(index)}
          >&times;</span>
        <h2>{car.year + " " + car.make + " " + car.model}</h2>
        <p>Color: {car.colour}</p>
        <p>Number of seats: {car.seats}</p>
        <p>Daily Price$: {car.dailyPrice}</p>
      </div>
    {/if}
  {/each}
</div>

<style>
  .filter-container {
    margin-bottom: 20px;
  }

  .filter-container select {
    padding: 8px;
    font-size: 14px;
    margin-right: 10px;
  }

  .car-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .car {
    width: calc(33.33% - 20px);
    margin-right: 10px;
    margin-bottom: 20px;
  }

  .car-inner {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .car img {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }

  .car h2 {
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 1.2em;
  }

  .car p {
    margin: 0;
  }

  .car button {
    margin-top: 10px;
  }

  .car:nth-child(3n) {
    margin-right: 0;
  }

  .popupCard {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 999;
  }

  .closeButton {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 24px;
    color: #999;
  }

  .closeButton:hover {
    color: #333;
  }

  .price-slider {
    width: 200px;
    margin-left: 10px;
  }

  .price-display {
    margin-left: 10px;
  }
</style>
