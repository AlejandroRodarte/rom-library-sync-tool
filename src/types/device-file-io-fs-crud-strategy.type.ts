import type DEVICE_FILE_IO_FS_CRUD_STRATEGIES from "../constants/device-file-io-fs-crud-strategies.constant.js";

export type DeviceFileIOFsCrudStrategy =
  (typeof DEVICE_FILE_IO_FS_CRUD_STRATEGIES)[number];
