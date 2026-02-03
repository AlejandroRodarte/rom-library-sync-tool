import type { FileIOStrategy } from "../types/file-io-strategy.type.js";
import type { FileIOStrategyEnvData } from "./file-io-strategy-env-data.interface.js";

export interface DeviceFileIOEnvData {
  strategy: {
    name: FileIOStrategy;
    data: {
      [S in FileIOStrategy]: FileIOStrategyEnvData[S];
    };
  };
}
