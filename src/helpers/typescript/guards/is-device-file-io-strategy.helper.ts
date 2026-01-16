import DEVICE_FILE_IO_STRATEGIES from "../../../constants/device-file-io-strategies.constant.js";
import type { DeviceFileIOStrategy } from "../../../types/device-file-io-strategy.type.js";

const isDeviceFileIOStrategy = (s: string): s is DeviceFileIOStrategy =>
  DEVICE_FILE_IO_STRATEGIES.includes(s as DeviceFileIOStrategy);

export default isDeviceFileIOStrategy;
