import type { ContentTargetPaths } from "../types/content-target-paths.type.js";
import type { LogLevel } from "../types/log-level.type.js";
import type { ModeName } from "../types/mode-name.type.js";
import type { DeviceEnvData } from "./devices/generic-device/device-env-data.interface.js";

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
      [deviceName: string]: DeviceEnvData;
    };
  };
}
