import type { ContentTargetName } from "../../types/content-targets/content-target-name.type.js";
import type { ContentTargetSkipFlags } from "./content-target-skip-flags.interface.js";

export interface ModeSkipFlags {
  global: boolean;
  "content-targets": {
    [C in ContentTargetName]: ContentTargetSkipFlags[C];
  };
}
