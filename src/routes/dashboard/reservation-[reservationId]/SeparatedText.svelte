<script lang="ts">
  export let title: string;
  export let content: string;
</script>

<div class="flex items-baseline justify-between gap-2">
  <h2 class="font-bold">{title}:</h2>
  <div
    class="flex-grow border-b-4 border-dotted border-black dark:border-white">
  </div>
  <p>{content}</p>
</div>
