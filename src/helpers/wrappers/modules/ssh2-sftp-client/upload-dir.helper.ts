import Client from "ssh2-sftp-client";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import typeGuards from "../../../typescript/guards/index.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentialsError from "../../../../classes/errors/file-io-bad-credentials-error.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";

export type UploadDirError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOBadTypeError;

const uploadDir = async (
  client: Client,
  ...args: Parameters<typeof client.uploadDir>
): Promise<UploadDirError | undefined> => {
  const [srcDir, dstDir] = args;

  try {
    await client.uploadDir(...args);
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return new UnknownError(
        `An error happened while uploading directory from source ${srcDir} to remote path at ${dstDir}.`,
      );

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new FileIOConnectionError(
          `Your client is not connected. Remote file path ${dstDir} can not be accessed.`,
        );
      case "ERR_BAD_AUTH":
        return new FileIOBadCredentialsError(
          `Credentials for this client failed authentication. Remote file path ${dstDir} can not be accessed.`,
        );
      case "ERR_BAD_PATH":
        return new FileIOBadPathError(
          `Source path ${srcDir} or destination path ${dstDir} are faulty.`,
        );
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is NOT authorized to put content on remote file path ${dstDir}.`,
        );
      case "ENOTDIR":
        return new FileIOBadTypeError(
          `Source path ${srcDir} is NOT a directory.`,
        );
      default:
        return new UnknownError(
          `Something went wrong while copying contents from source directory ${srcDir} to remote directory ${dstDir}.`,
        );
    }
  }
};

export default uploadDir;
