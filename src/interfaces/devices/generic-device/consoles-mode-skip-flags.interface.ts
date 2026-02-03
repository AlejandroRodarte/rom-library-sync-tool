import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { ConsolesContentTargetsSkipFlags } from "./consoles-content-targets-skip-flags.interface.js";

export interface ConsolesModeSkipFlags {
  global: boolean;
  "content-targets": {
    [C in ContentTargetName]: ConsolesContentTargetsSkipFlags[C];
  };
}
