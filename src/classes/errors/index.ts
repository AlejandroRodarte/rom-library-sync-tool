import FsNotFoundError from "./fs-not-found-error.class.js";
import SftpConnectionError from "./sftp-connection-error.class.js";
import SftpDisconnectionError from "./sftp-disconnection-error.class.js";
import FsUnauthorizedError from "./fs-unauthorized-error.class.js";
import UnknownError from "./unknown-error.class.js";
import FsWrongTypeError from "./fs-wrong-type-error.class.js";
import SftpNotFoundError from "./sftp-not-found-error.class.js";
import SftpWrongTypeError from "./sftp-wrong-type-error.class.js";
import SftpBadPathError from "./sftp-bad-path.class.js";
import SftpUnauthorizedError from "./sftp-unauthorized-error.class.js";
import SftpBadCredentialsError from "./sftp-bad-credentials.class.js";
import FsFileExistsError from "./fs-file-exists-error.class.js";
import AppNotFoundError from "./app-not-found-error.class.js";

const errorClasses = {
  AppNotFoundError,
  SftpConnectionError,
  SftpDisconnectionError,
  UnknownError,
  FsUnauthorizedError,
  FsNotFoundError,
  FsFileExistsError,
  FsWrongTypeError,
  SftpNotFoundError,
  SftpWrongTypeError,
  SftpBadPathError,
  SftpUnauthorizedError,
  SftpBadCredentialsError,
};

export default errorClasses;
