import DEVICE_NAMES from "../../../constants/device-names.constant.js";
import type { DeviceName } from "../../../types.js";

const isDeviceName = (deviceName: string): deviceName is DeviceName =>
  DEVICE_NAMES.includes(deviceName as DeviceName);

export default isDeviceName;
