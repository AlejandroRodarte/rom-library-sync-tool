import type DEVICE_FILE_IO_STRATEGIES from "../constants/device-file-io-strategies.constant.js";

export type DeviceFileIOStrategy = (typeof DEVICE_FILE_IO_STRATEGIES)[number];
