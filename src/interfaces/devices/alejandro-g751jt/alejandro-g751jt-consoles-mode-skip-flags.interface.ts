import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { AlejandroG751JTConsolesContentTargetsSkipFlags } from "./alejandro-g751jt-consoles-content-targets-skip-flags.interface.js";

export interface AlejandroG751JTConsolesModeSkipFlags {
  global: boolean;
  "content-targets": {
    [C in ContentTargetName]: AlejandroG751JTConsolesContentTargetsSkipFlags[C];
  };
}
