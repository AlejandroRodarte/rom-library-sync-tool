import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ContentTargetContent } from "../../../types/content-target-content.type.js";
import type { AlejandroG751JTConsolesSkipFlags } from "./alejandro-g751jt-consoles-skip-flags.interface.js";

export interface AlejandroG751JTSkipFlags {
  "content-targets": ContentTargetContent<boolean>;
  consoles: Partial<ConsoleContent<AlejandroG751JTConsolesSkipFlags>>;
}
