// why would DeviceFileIO.ls() fail?
// 1. because the path is not valid
// 2. because the path is valid, but does not exist
// 3. because the path is valid and exists, but is not a directory
// 4. because we are unauthorized to access it
// 5. becase there was a connecton issue
const DEVICE_FILE_IO_LS_METHOD_SPECIFIC_ERROR_CODES = [
  "BAD_PATH_ERROR",
  "PATH_DOES_NOT_EXIST_ERROR",
  "NOT_A_DIRECTORY_ERROR",
  "UNAUTHORIZED_ERROR",
  "CONNECTION_ERROR",
  "UNKNOWN_ERROR",
] as const;

export default DEVICE_FILE_IO_LS_METHOD_SPECIFIC_ERROR_CODES;
