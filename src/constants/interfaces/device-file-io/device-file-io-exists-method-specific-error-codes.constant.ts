// why would DeviceFileIO.exists() fail?
// 1. because the path is not valid
// 2. because the path is valid, but does not exist
// 3. because the path exists, but is not of the correct type (file|dir|link)
// 4. because we are unauthorized to access the path
// 5. because there was a problem parsing the `rights` parameter
// 6. because there was a connection issue
const DEVICE_FILE_IO_EXISTS_METHOD_SPECIFIC_ERROR_CODES = [
  "BAD_PATH_ERROR",
  "PATH_DOES_NOT_EXIST_ERROR",
  "BAD_FILE_TYPE_ERROR",
  "UNAUTHORIZED_ERROR",
  "RIGHTS_VALIDATION_ERROR",
  "CONNECTION_ERROR",
  "UNKNOWN_ERROR",
] as const;

export default DEVICE_FILE_IO_EXISTS_METHOD_SPECIFIC_ERROR_CODES;
