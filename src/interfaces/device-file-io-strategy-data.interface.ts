import type { DeviceFileIOFsCrudStrategy } from "../types/device-file-io-fs-crud-strategy.type.js";
import type { SftpCredentials } from "./sftp-credentials.interface.js";

export interface DeviceFileIOStrategyData {
  fs: {
    crud: {
      strategy: DeviceFileIOFsCrudStrategy;
    };
  };
  sftp: {
    credentials: SftpCredentials;
  };
}
