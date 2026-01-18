import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentials from "../../../../classes/errors/file-io-bad-credentials.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";

export type DeleteError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentials
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOBadTypeError;

const sftpDelete = async (
  client: Client,
  ...args: Parameters<typeof client.delete>
): Promise<DeleteError | undefined> => {
  const [remoteFilePath] = args;

  try {
    await client.delete(...args);
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return new UnknownError(
        `Unknown error happened while deleting remote file on path ${remoteFilePath}.`,
      );

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new FileIOConnectionError(
          `Your client is not connected. Remote file path ${remoteFilePath} can not be accessed.`,
        );
      case "ERR_BAD_AUTH":
        return new FileIOBadCredentials(
          `Credentials for this client failed authentication. Remote file path ${remoteFilePath} can not be accessed.`,
        );
      case "ERR_BAD_PATH":
        return new FileIOBadPathError(
          `Remote file path ${remoteFilePath} is faulty.`,
        );
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is NOT authorized to delete file on remote path ${remoteFilePath}.`,
        );
      case "EISDIR":
        return new FileIOBadTypeError(
          `Remote file path ${remoteFilePath} is a directory, NOT a file.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while deleting file on remote path ${remoteFilePath}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default sftpDelete;
