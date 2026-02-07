import type { RomTitleNameBuildStrategy } from "../../../../../types/roms/rom-title-name-build-strategy.type.js";

export interface GenericDevicePopulateEnvData {
  games: {
    titleName: {
      strategy: RomTitleNameBuildStrategy;
    };
  };
}
