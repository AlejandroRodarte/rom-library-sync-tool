import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ContentTargetContent } from "../../../types/content-target-content.type.js";
import type { ConsolesSkipFlags } from "./consoles-skip-flags.interface.js";

export interface GenericDeviceSkipFlags {
  "content-targets": ContentTargetContent<boolean>;
  consoles: Partial<ConsoleContent<ConsolesSkipFlags>>;
}
