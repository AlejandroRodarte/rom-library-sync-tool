import type { DeviceFileIOFsLsMethodSpecificErrorCodeDictionary } from "../../../../../types/interfaces/device-file-io/implementors/fs/device-file-io-fs-ls-method-specific-error-code-dictionary.js";

const deviceFileIOFsLsMethodSpecificErrorCodeDictionary: DeviceFileIOFsLsMethodSpecificErrorCodeDictionary =
  {
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
    FS_NOT_FOUND_ERROR: "PATH_DOES_NOT_EXIST_ERROR",
    FS_WRONG_TYPE_ERROR: "NOT_A_DIRECTORY_ERROR",
    FS_UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
  };

export default deviceFileIOFsLsMethodSpecificErrorCodeDictionary;
