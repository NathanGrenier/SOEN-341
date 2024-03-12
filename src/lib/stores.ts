import { writable } from "svelte/store";
import type { TabStatus } from "../routes/dashboard/+page.svelte";

type Pages = {
  [key in TabStatus]?: number;
};

export const tablePages = writable<Pages>({});
