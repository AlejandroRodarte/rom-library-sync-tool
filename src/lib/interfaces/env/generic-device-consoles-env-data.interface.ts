import type { GenericDeviceConsolesDataEnvData } from "../../types/classes/devices/generic-device/env/generic-device-consoles-data-env-data.type.js";
import type { ConsoleName } from "../../types/consoles/console-name.type.js";

export interface GenericDeviceConsolesEnvData {
  list: ConsoleName[];
  data: GenericDeviceConsolesDataEnvData;
}
