import type { ConsolesGamesFilterFn } from "../../../../types/consoles/consoles-games-filter-fn.type.js";
import type { DeviceEnvDataToGenericDevicePathsFn } from "../../../../types/paths/device-env-data-to-generic-device-paths-fn.type.js";

export interface GenericDeviceOpts {
  filter: {
    roms: {
      consolesGamesFilterFn: ConsolesGamesFilterFn;
    };
  };
  build: {
    paths: {
      deviceEnvDataToGenericDevicePathsFn: DeviceEnvDataToGenericDevicePathsFn;
    };
  };
}
