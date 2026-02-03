import type { ConsoleName } from "../types/console-name.type.js";
import type { ContentTargetName } from "../types/content-target-name.type.js";
import type { ConsoleContentTargetsData } from "./console-content-targets-data.interface.js";
import type { GenericDeviceSkipFlags } from "./devices/generic-device/generic-device-skip-flags.interface.js";

export interface ConsoleData {
  name: ConsoleName;
  "content-targets": {
    [C in Extract<ContentTargetName, "media">]: ConsoleContentTargetsData[C];
  };
  skipFlags: GenericDeviceSkipFlags;
}
