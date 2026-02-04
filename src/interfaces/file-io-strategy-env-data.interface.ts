import type { FS, SFTP } from "../constants/file-io-strategies.constants.js";
import type { FileIOFsCrudStrategy } from "../types/file-io-fs-crud-strategy.type.js";
import type { SftpCredentials } from "./sftp-credentials.interface.js";

export interface FileIOStrategyEnvData {
  [FS]: {
    crud: {
      strategy: FileIOFsCrudStrategy;
    };
  };
  [SFTP]: {
    credentials: SftpCredentials;
  };
}
