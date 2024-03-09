<script lang="ts">
  import Datatable from "$lib/components/client/Datatable.svelte";
</script>

<div class="card">
  <header class="card-header text-center font-bold">
    <h1 class="h1 p-5">Dashboard</h1>
  </header>
  <div class="container flex flex-col space-y-10 p-5">
    <div class="card flex flex-col space-y-10 p-10">
      <div class="container">
        <Datatable />
      </div>
      <div class="container">
        <div class="container flex flex-row justify-center space-x-2 font-bold">
          <div>
            <button type="button" class="variant-filled btn"
              >Load all Users</button>
          </div>
          <div>
            <button type="button" class="variant-filled btn"
              >Load all Vehicles</button>
          </div>
          <div>
            <button type="button" class="variant-filled btn"
              >Load all Reservations</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex justify-center text-center">
      <div class="container p-5 font-bold">
        <button type="button" class="variant-filled btn"
          >Delete Something</button>
      </div>
      <div class="container p-5 font-bold">
        <button type="button" class="variant-filled btn"
          >Create Something</button>
      </div>
    </div>
  </div>
</div>

<!-- </div> -->
<!-- <div class="card">
        <label class="label p-5 text-center font-bold">
          <div class="container p-2">
            <span>User Lookup</span>
          </div>
          <div class="container p-2">
            <input class="input" type="text" placeholder="User ID #" />
          </div>
          <div class="container p-2">
            <button type="button" class="variant-filled btn">Fetch User</button>
          </div>
        </label>
      </div>

      <div class="card">
        <label class="label p-5 text-center font-bold">
          <div class="container p-2">
            <span>Reservation Lookup</span>
          </div>
          <div class="container p-2">
            <input class="input" type="text" placeholder="Reservation ID #" />
          </div>
          <div class="container p-2">
            <button type="button" class="variant-filled btn"
              >Fetch Reservation</button>
          </div>
        </label>
      </div>
      <div class="card p-5">
        <div class="container p-5">
          <Datatable />
        </div>
        <div class="container flex flex-row justify-center space-x-2 font-bold">
          <div>
            <button type="button" class="variant-filled btn"
              >Load all Users</button>
          </div>
          <div>
            <button type="button" class="variant-filled btn"
              >Load all Vehicles</button>
          </div>
          <div>
            <button type="button" class="variant-filled btn"
              >Load all Reservations</button>
          </div>
        </div> -->
<!-- </div> -->

<!-- Column -->
<!-- <div class="card flex flex-col space-y-10 p-10">
      <div class="container">
        <h2 class="h2 text-center font-bold">Name</h2>
      </div>
      <div class=" self-center p-5">
        <div class="container">
          <div class="placeholder-circle w-32" />
        </div>
      </div>
      <div class="card grid grid-cols-3 gap-2 p-5">
        <div class="placeholder" />
        <div class="placeholder" />
        <div class="placeholder" />
        <div class="placeholder" />
        <div class="placeholder" />
        <div class="placeholder" />
        <div class="placeholder" />
        <div class="placeholder" />
        <div class="placeholder" />
      </div> -->

<!-- <div class="container text-center">
        <button type="button" class="variant-filled btn"
          >Update Information</button>
      </div> -->
