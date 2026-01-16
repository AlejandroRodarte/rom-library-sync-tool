import DEVICE_FILE_IO_FS_CRUD_STRATEGIES from "../../../constants/device-file-io-fs-crud-strategies.constant.js";
import type { DeviceFileIOFsCrudStrategy } from "../../../types/device-file-io-fs-crud-strategy.type.js";

const isDeviceFileIOFsCrudStrategy = (
  s: string,
): s is DeviceFileIOFsCrudStrategy =>
  DEVICE_FILE_IO_FS_CRUD_STRATEGIES.includes(s as DeviceFileIOFsCrudStrategy);

export default isDeviceFileIOFsCrudStrategy;
