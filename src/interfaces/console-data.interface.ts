import type { ConsoleName } from "../types/console-name.type.js";
import type { ContentTargetName } from "../types/content-target-name.type.js";
import type { ConsoleContentTargetsData } from "./console-content-targets-data.interface.js";
import type { AlejandroG751JTConsolesSkipFlags } from "./devices/alejandro-g751jt/alejandro-g751jt-consoles-skip-flags.interface.js";

export interface ConsoleData {
  name: ConsoleName;
  "content-targets": {
    [C in Extract<ContentTargetName, "media">]: ConsoleContentTargetsData[C];
  };
  skipFlags: AlejandroG751JTConsolesSkipFlags;
}
