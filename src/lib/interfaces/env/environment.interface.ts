import type { ContentTargetPaths } from "../../types/content-targets/content-target-paths.type.js";
import type { LogLevel } from "../../types/log-level.type.js";
import type { ModeName } from "../../types/modes/mode-name.type.js";
import type { GenericDeviceEnvData } from "../classes/devices/generic-device/env/generic-device-env-data.interface.js";

export interface Environment {
  options: {
    log: {
      level: LogLevel;
    };
    mode: ModeName;
    simulate: {
      sync: boolean;
    };
  };
  database: {
    paths: ContentTargetPaths;
  };
  device: {
    names: string[];
    data: {
      [deviceName: string]: {
        generic: GenericDeviceEnvData;
        specific: any;
      };
    };
  };
}
