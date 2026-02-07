import type { GenericDeviceConsolesEnvData } from "../../../../../types/classes/devices/generic-device/env/generic-device-consoles-env-data.type.js";
import type { GenericDeviceContentTargetsEnvData } from "./generic-device-content-targets-env-data.interface.js";
import type { GenericDeviceFileIOEnvData } from "./generic-device-file-io-env-data.interface.js";
import type { GenericDevicePopulateEnvData } from "./generic-device-populate-env-data.interface.js";

export interface GenericDeviceEnvData {
  populate: GenericDevicePopulateEnvData;
  consoles: GenericDeviceConsolesEnvData;
  "content-targets": GenericDeviceContentTargetsEnvData;
  fileIO: GenericDeviceFileIOEnvData;
}
