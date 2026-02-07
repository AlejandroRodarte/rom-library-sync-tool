import buildGenericDevicePathsUsingDefaultStrategy from "../../helpers/classes/devices/generic-device/build/paths/build-generic-device-paths-using-default-strategy.helper.js";
import type { DeviceEnvDataToGenericDevicePathsFn } from "../../types/paths/device-env-data-to-generic-device-paths-fn.type.js";

const genericDevicePathsFromDeviceEnvDataBuilders: {
  [deviceName: string]: DeviceEnvDataToGenericDevicePathsFn;
} = {
  "alejandro-g751jt": buildGenericDevicePathsUsingDefaultStrategy,
  "steam-deck-lcd-alejandro": buildGenericDevicePathsUsingDefaultStrategy,
  default: buildGenericDevicePathsUsingDefaultStrategy,
};

export default genericDevicePathsFromDeviceEnvDataBuilders;
