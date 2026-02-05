import type { FileIOStrategy } from "../../../../../types/file-io/file-io-strategy.type.js";
import type { GenericDeviceFileIOStrategyEnvData } from "./generic-device-file-io-strategy-env-data.interface.js";

export interface GenericDeviceFileIOEnvData {
  strategy: {
    name: FileIOStrategy;
    data: {
      [S in FileIOStrategy]: GenericDeviceFileIOStrategyEnvData[S];
    };
  };
}
