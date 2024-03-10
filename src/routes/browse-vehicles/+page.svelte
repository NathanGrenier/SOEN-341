<script>
  let cars = [
    {
      src: "cars/corola.png",
      alt: "Car 1",
      model: "Car Model 1",
      description: "Description of Car 1",
    },
    // Add more initial cars as needed
  ];

  function addCar() {
    cars = [
      ...cars,
      {
        src: "cars/corola.png",
        alt: "New Car",
        model: "New Car Model",
        description: "New Car Description",
      },
    ];
  }
</script>

<div class="car-container">
  {#each cars as car}
    <div class="car">
      <img src={car.src} alt={car.alt} />
      <h2>{car.model}</h2>
      <p>{car.description}</p>
      <button
        class="cursor-pointer rounded-lg border-b-[4px] border-blue-600 bg-blue-500 px-6 py-2 text-white transition-all hover:-translate-y-[1px] hover:border-b-[6px] hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] active:brightness-90">
        Button
      </button>
    </div>
  {/each}
</div>

<button on:click={addCar}>Add Car</button>

<style>
  .car-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .car {
    width: calc(33.33% - 20px);
    margin-right: 10px;
    margin-bottom: 20px;
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
    margin-top: 10px; /* Adjust margin as needed */
  }

  .car:nth-child(3n) {
    margin-right: 0;
  }
</style>
