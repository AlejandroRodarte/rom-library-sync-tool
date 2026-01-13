import type { DeviceData } from "../types/device-data.type.js";
import type { DeviceName } from "../types/device-name.type.js";
import type { LogLevel } from "../types/log-level.type.js";
import type { ModeContent } from "../types/mode-content.type.js";
import type { ModeName } from "../types/mode-name.type.js";

export interface Environment {
  options: {
    log: {
      level: LogLevel;
    };
    mode: ModeName;
  };
  paths: {
    db: {
      roms: string;
      media: string;
      metadata: string;
    };
  };
  modes: ModeContent<{ devices: DeviceName[]; simulate?: boolean }>;
  devices: {
    [D in DeviceName]: DeviceData<D>;
  };
}
