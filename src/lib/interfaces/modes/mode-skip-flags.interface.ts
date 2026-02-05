import type { ContentTargetName } from "../../types/content-targets/content-target-name.type.js";
import type { ModeContentTargetsSkipFlags } from "./mode-content-targets-skip-flags.interface.js";

export interface ModeSkipFlags {
  global: boolean;
  "content-targets": {
    [C in ContentTargetName]: ModeContentTargetsSkipFlags[C];
  };
}
