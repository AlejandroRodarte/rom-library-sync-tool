import type { ConsolesModeSkipFlags } from "./consoles-mode-skip-flags.interface.js";

export interface ConsolesSkipFlags {
  global: boolean;
  list: ConsolesModeSkipFlags;
  diff: ConsolesModeSkipFlags;
  sync: ConsolesModeSkipFlags;
}
