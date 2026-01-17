import type { DeviceFileIOFsExistsMethodSpecificErrorCodeDictionary } from "../../../../../types/interfaces/device-file-io/implementors/fs/device-file-io-fs-exists-method-specific-error-code-dictionary.js";

const deviceFileIOFsExistsMethodSpecificErrorCodeDictionary: DeviceFileIOFsExistsMethodSpecificErrorCodeDictionary =
  {
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
    FS_WRONG_TYPE_ERROR: "BAD_FILE_TYPE_ERROR",
    FS_NOT_FOUND_ERROR: "PATH_DOES_NOT_EXIST_ERROR",
    APP_VALIDATION_ERROR: "RIGHTS_VALIDATION_ERROR",
    FS_UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
  };

export default deviceFileIOFsExistsMethodSpecificErrorCodeDictionary;
