import type { FileIOFsCrudStrategy } from "../types/file-io-fs-crud-strategy.type.js";
import type { SftpCredentials } from "./sftp-credentials.interface.js";

export interface FileIOStrategyEnvData {
  fs: {
    crud: {
      strategy: FileIOFsCrudStrategy;
    };
  };
  sftp: {
    credentials: SftpCredentials;
  };
}
