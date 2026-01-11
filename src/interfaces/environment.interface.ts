import type { DeviceData } from "../types/device-data.type.js";
import type { DeviceName } from "../types/device-name.type.js";
import type { LogLevel } from "../types/log-level.type.js";

export interface Environment {
  options: {
    filter: {
      devices: DeviceName[];
    };
    sync: {
      simulate: boolean;
      devices: DeviceName[];
    };
    log: {
      level: LogLevel;
    };
  };
  paths: {
    dbs: {
      roms: string;
      media: string;
      gamelists: string;
    };
  };
  devices: {
    [D in DeviceName]: DeviceData<D>;
  };
}
