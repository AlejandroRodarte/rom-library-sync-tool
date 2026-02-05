import type { ModeSkipFlags } from "./mode-skip-flags.interface.js";

export interface ModesSkipFlags {
  global: boolean;
  list: ModeSkipFlags;
  diff: ModeSkipFlags;
  sync: ModeSkipFlags;
}
