import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { AlejandroG751JTConsolesSkipFlags } from "./alejandro-g751jt-consoles-skip-flags.interface.js";
import type { AlejandroG751JTContentTargetsSkipFlags } from "./alejandro-g751jt-content-targets-skip-flags.interface.js";

export interface AlejandroG751JTSkipFlags {
  "content-targets": {
    [C in ContentTargetName]: AlejandroG751JTContentTargetsSkipFlags[C];
  };
  consoles: Partial<ConsoleContent<AlejandroG751JTConsolesSkipFlags>>;
}
