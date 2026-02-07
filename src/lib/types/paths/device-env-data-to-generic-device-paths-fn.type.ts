import type { GenericDevicePaths } from "../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { Environment } from "../../interfaces/env/environment.interface.js";

export type DeviceEnvDataToGenericDevicePathsFn = (
  deviceName: string,
  deviceEnvData: Environment["device"]["data"][string],
) => GenericDevicePaths;
