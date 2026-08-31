import type { GenericDeviceConsolesEnvData } from "../../../../env/generic-device-consoles-env-data.interface.js";
import type { GenericDeviceContentTargetsEnvData } from "./generic-device-content-targets-env-data.interface.js";
import type { GenericDeviceFileIOEnvData } from "./generic-device-file-io-env-data.interface.js";
import type { GenericDevicePopulateEnvData } from "./generic-device-populate-env-data.interface.js";

export interface GenericDeviceEnvData {
  populate: GenericDevicePopulateEnvData;
  consoles: GenericDeviceConsolesEnvData;
  "content-targets": GenericDeviceContentTargetsEnvData;
  fileIO: GenericDeviceFileIOEnvData;
}
