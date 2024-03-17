<script lang="ts">
  export let title: string;
  export let content: string;
</script>

<div class="flex items-baseline justify-between gap-2">
  <h3 class="font-bold">{title}:</h3>
  <div
    class="flex-grow border-b-4 border-dotted border-black dark:border-white">
  </div>
  <p>{content}</p>
</div>
