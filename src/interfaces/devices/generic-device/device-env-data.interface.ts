import type { DeviceConsolesEnvData } from "../../../types/device-consoles-env-data.type.js";
import type { DeviceContentTargetsEnvData } from "../../device-content-targets-env-data.interface.js";
import type { DeviceFileIOEnvData } from "../../device-file-io-env-data.interface.js";

export interface DeviceEnvData {
  consoles: DeviceConsolesEnvData;
  "content-targets": DeviceContentTargetsEnvData;
  fileIO: DeviceFileIOEnvData;
}
