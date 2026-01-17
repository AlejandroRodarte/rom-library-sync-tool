import type { DeviceFileIOSftpExistsMethodSpecificErrorCodeDictionary } from "../../../../../types/interfaces/device-file-io/implementors/sftp/device-file-io-sftp-exists-method-specific-error-code-dictionary.js";

const deviceFileIOSftpExistsMethodSpecificErrorCodeDictionary: DeviceFileIOSftpExistsMethodSpecificErrorCodeDictionary =
  {
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
    APP_VALIDATION_ERROR: "RIGHTS_VALIDATION_ERROR",
    SFTP_BAD_PATH_ERROR: "PATH_DOES_NOT_EXIST_ERROR",
    SFTP_NOT_FOUND_ERROR: "PATH_DOES_NOT_EXIST_ERROR",
    SFTP_CONNECTION_ERROR: "CONNECTION_ERROR",
    SFTP_WRONG_TYPE_ERROR: "BAD_FILE_TYPE_ERROR",
    SFTP_UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
    SFTP_BAD_CREDENTIALS_ERROR: "UNAUTHORIZED_ERROR",
  };

export default deviceFileIOSftpExistsMethodSpecificErrorCodeDictionary;
