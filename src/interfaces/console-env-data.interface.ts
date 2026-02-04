import type { MEDIA } from "../constants/content-target-names.constants.js";
import type { ConsoleName } from "../types/console-name.type.js";
import type { ContentTargetName } from "../types/content-target-name.type.js";
import type { ConsoleContentTargetsEnvData } from "./console-content-targets-env-data.interface.js";

export interface ConsoleEnvData {
  name: ConsoleName;
  "content-targets": {
    [C in Extract<
      ContentTargetName,
      typeof MEDIA
    >]: ConsoleContentTargetsEnvData[C];
  };
}
