import FileIONotFoundError from "./file-io-not-found-error.class.js";
import FileIOConnectionError from "./file-io-connection-error.class.js";
import FileIODisconnectionError from "./file-io-disconnection-error.class.js";
import FileIOUnauthorizedError from "./file-io-unauthorized-error.class.js";
import UnknownError from "./unknown-error.class.js";
import FileIOBadTypeError from "./file-io-bad-type-error.class.js";
import SftpNotFoundError from "./sftp-not-found-error.class.js";
import SftpWrongTypeError from "./sftp-wrong-type-error.class.js";
import FileIOBadPathError from "./file-io-bad-path-error.class.js";
import SftpUnauthorizedError from "./sftp-unauthorized-error.class.js";
import FileIOBadCredentialsError from "./file-io-bad-credentials-error.class.js";
import FileIOExistsError from "./file-io-exists-error.class.js";
import AppNotFoundError from "./app-not-found-error.class.js";
import AppValidationError from "./app-validation-error.class.js";
import AppBadTypeError from "./app-bad-type-error.class.js";
import AppExistsError from "./app-exists-error.class.js";
import FileIOCircularReferenceError from "./file-io-circular-reference-error.class.js";

const errorClasses = {
  AppNotFoundError,
  AppValidationError,
  AppBadTypeError: AppWrongTypeError,
  AppExistsError: AppEntryExistsError,
  FileIOConnectionError: SftpConnectionError,
  FileIODisconnectionError: SftpDisconnectionError,
  UnknownError,
  FileIOUnauthorizedError: FsUnauthorizedError,
  FileIONotFoundError: FsNotFoundError,
  FileIOExistsError: FsFileExistsError,
  FsBadTypeError: FsWrongTypeError,
  FileIOCircularReferenceError: FsCircularReferenceError,
  SftpNotFoundError,
  SftpWrongTypeError,
  FileIOBadPathError: SftpBadPathError,
  SftpUnauthorizedError,
  FileIOBadCredentials: SftpBadCredentialsError,
};

export default errorClasses;
