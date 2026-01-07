import Client from "ssh2-sftp-client";
import typeGuards from "../typescript/guards/index.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import SftpConnectionError from "../../classes/errors/sftp-connection-error.class.js";
import SftpBadCredentialsError from "../../classes/errors/sftp-bad-credentials.class.js";
import SftpBadPathError from "../../classes/errors/sftp-bad-path.class.js";
import SftpUnauthorizedError from "../../classes/errors/sftp-unauthorized-error.class.js";
import SftpWrongTypeError from "../../classes/errors/sftp-wrong-type-error.class.js";

export type DeleteError =
  | UnknownError
  | SftpConnectionError
  | SftpBadCredentialsError
  | SftpBadPathError
  | SftpUnauthorizedError
  | SftpWrongTypeError;

const sftpDelete = async (
  client: Client,
  remoteFilePath: string,
  fileMustExist = false,
): Promise<DeleteError | undefined> => {
  try {
    await client.delete(remoteFilePath, fileMustExist);
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return new UnknownError(
        `Unknown error happened while deleting remote file on path ${remoteFilePath}.`,
      );

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new SftpConnectionError(
          `Your client is not connected. Remote file path ${remoteFilePath} can not be accessed. Original error message: ${e.message}.`,
        );
      case "ERR_BAD_AUTH":
        return new SftpBadCredentialsError(
          `Credentials for this client failed authentication. Remote file path ${remoteFilePath} can not be accessed. Original error message: ${e.message}.`,
        );
      case "ERR_BAD_PATH":
        return new SftpBadPathError(
          `Remote file path ${remoteFilePath} is faulty. Original error message: ${e.message}.`,
        );
      case "EACCES":
      case "EPERM":
        return new SftpUnauthorizedError(
          `This process is NOT authorized to delete file on remote path ${remoteFilePath}. Original error message: ${e.message}.`,
        );
      case "EISDIR":
        return new SftpWrongTypeError(
          `Remote file path ${remoteFilePath} is a directory, NOT a file. Original error message: ${e.message}.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while deleting file on remote path ${remoteFilePath}. Error code: ${e.code}. Original error message: ${e.message}.`,
        );
    }
  }
};

export default sftpDelete;
