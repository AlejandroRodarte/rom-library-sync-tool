import type {
  FS,
  SFTP,
} from "../../../../../constants/file-io/file-io-strategies.constants.js";
import type { FileIOFsCrudStrategy } from "../../../../../types/file-io/file-io-fs-crud-strategy.type.js";
import type { SftpCredentials } from "../../../../sftp/sftp-credentials.interface.js";

export interface GenericDeviceFileIOStrategyEnvData {
  [FS]: {
    crud: {
      strategy: FileIOFsCrudStrategy;
    };
  };
  [SFTP]: {
    credentials: SftpCredentials;
  };
}
