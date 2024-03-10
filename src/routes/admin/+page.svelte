<script lang="ts">
  import Datatable from "$lib/components/client/Datatable.svelte";
  import data from "$lib/components/client/data";
  $: selectedKey = -1;
  $: isSelected = false;

  let selectedRowId: number = -1;

  function handleRowClick(event: { detail: number }) {
    selectedRowId = event.detail;
    console.log(selectedRowId);
  }

  let unique = {};

  function restart() {
    unique = {};
  }
</script>

<div class="card">
  <header class="card-header text-center font-bold">
    <h1 class="h1 p-5">Admin Dashboard</h1>
  </header>
  <div class="container flex flex-col space-y-10 p-5">
    <div class="card flex flex-col space-y-10 p-10">
      <div class="container">
        {#if isSelected == true}
          {#key unique}
            <Datatable fetchCase={selectedKey} on:rowClick={handleRowClick} />
          {/key}
        {:else}
          <h3 class="h3 text-center font-bold">
            Please select an option to fetch the table.
          </h3>
        {/if}
      </div>
      <div class="container">
        <div class="container flex flex-row justify-center space-x-2 font-bold">
          <div>
            <button
              type="button"
              class="variant-filled btn"
              on:click={() => {
                restart();
                selectedKey = 1;
                isSelected = true;
                selectedRowId = -1;
              }}>Load all Users</button>
          </div>
          <div>
            <button
              type="button"
              on:click={() => {
                restart();
                selectedKey = 2;
                isSelected = true;
                selectedRowId = -1;
              }}
              class="variant-filled btn">Load all Vehicles</button>
          </div>
          <div>
            <button
              type="button"
              on:click={() => {
                restart();
                selectedKey = 3;
                isSelected = true;
                selectedRowId = -1;
              }}
              class="variant-filled btn">Load all Reservations</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex justify-center text-center">
      <div class="container p-5 font-bold">
        {#if isSelected == false}
          <h1>
            You will be able to select an entry in the table, and modify any
            attributes as needed.
          </h1>
        {:else if data && selectedRowId !== -1}
          <div class="table-container">
            <form>
              <table class="table table-hover">
                <thead>
                  <tr>
                    {#each Object.keys(data[selectedRowId - 1]) as key}
                      <th>{key}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {#each Object.entries(data[selectedRowId - 1]) as [key, value]}
                      <td>
                        <input
                          type="text"
                          name={key}
                          {value}
                          class="input variant-form-material" />
                      </td>
                    {/each}
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
          <div class="flex">
            <div class="container p-3">
              <button type="button" class="variant-filled btn">
                Update Information
              </button>
            </div>
            <div class="container p-3">
              <button type="button" class="variant-filled btn">
                Generate an Entry.
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
