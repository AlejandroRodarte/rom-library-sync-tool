import type { AlejandroG751JTConsolesModeSkipFlags } from "./alejandro-g751jt-consoles-mode-skip-flags.interface.js";

export interface AlejandroG751JTConsolesSkipFlags {
  global: boolean;
  list: AlejandroG751JTConsolesModeSkipFlags;
  diff: AlejandroG751JTConsolesModeSkipFlags;
  sync: AlejandroG751JTConsolesModeSkipFlags;
}
