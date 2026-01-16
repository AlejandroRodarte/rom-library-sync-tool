const ERROR_TYPE_NAMES = [
  "AppEntryExistsError",
  "AppNotFoundError",
  "AppValidationError",
  "AppWrongTypeError",
  "DeviceFileIOExistsError",
  "DeviceFileIOLsError",
  "FsCircularReferenceError",
  "FsFileExistsError",
  "FsNotFoundError",
  "FsUnauthorizedError",
  "FsWrongTypeError",
  "SftpBadCredentialsError",
  "SftpBadPathError",
  "SftpConnectionError",
  "SftpDisconnectionError",
  "SftpNotFoundError",
  "SftpUnauthorizedError",
  "SftpWrongTypeError",
  "UnknownError",
] as const;

export default ERROR_TYPE_NAMES;
