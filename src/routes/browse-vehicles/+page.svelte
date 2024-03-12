<script>
  // You can add JavaScript logic here if needed
</script>

<div class="car-container">
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 2" />
    <h2>Car Model 2</h2>
    <p>Description of Car 2</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <div class="car">
    <img src="cars/corola.png" alt="Car 1" />
    <h2>Car Model 1</h2>
    <p>Description of Car 1</p>
  </div>
  <!-- Add more cars as needed -->
</div>

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

  .car:nth-child(3n) {
    margin-right: 0;
  }
</style>
