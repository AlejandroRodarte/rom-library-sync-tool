import type { MEDIA } from "../../../../../constants/content-targets/content-target-names.constants.js";
import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";
import type { ContentTargetName } from "../../../../../types/content-targets/content-target-name.type.js";
import type { GenericDeviceConsoleContentTargetsEnvData } from "./generic-device-console-content-targets-env-data.interface.js";

export interface GenericDeviceConsoleEnvData {
  name: ConsoleName;
  "content-targets": {
    [C in Extract<
      ContentTargetName,
      typeof MEDIA
    >]: GenericDeviceConsoleContentTargetsEnvData[C];
  };
}
