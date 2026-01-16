import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { SteamDeckLCDAlejandroConsolesContentTargetsSkipFlags } from "./steam-deck-lcd-alejandro-consoles-content-targets-skip-flags.interface.js";

export interface SteamDeckLCDAlejandroConsoleSkipFlags {
  global: boolean;
  filter: boolean;
  sync: {
    global: boolean;
    "content-targets": {
      [C in ContentTargetName]: SteamDeckLCDAlejandroConsolesContentTargetsSkipFlags[C];
    };
  };
}
