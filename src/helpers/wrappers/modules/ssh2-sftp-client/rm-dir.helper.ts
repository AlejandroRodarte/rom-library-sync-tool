import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentialsError from "../../../../classes/errors/file-io-bad-credentials-error.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";

export type RmDirError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOBadTypeError;

const rmDir = async (
  client: Client,
  ...args: Parameters<typeof client.rmdir>
): Promise<RmDirError | undefined> => {
  const [path] = args;

  try {
    await client.rmdir(path);
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return new UnknownError(
        `An unknown error happened while deleting remote directory at ${path}.`,
      );

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new FileIOConnectionError(
          `Your client is not connected. Remote dir path ${path} can not be accessed.`,
        );
      case "ERR_BAD_AUTH":
        return new FileIOBadCredentialsError(
          `Credentials for this client failed authentication. Remote dir path ${path} can not be accessed.`,
        );
      case "ERR_BAD_PATH":
        return new FileIOBadPathError(`Remote dirpath ${path} is faulty.`);
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is NOT authorized to delete dirpath ${path}.`,
        );
      case "ENOTDIR":
        return new FileIOBadTypeError(
          `Remote path ${path} is NOT a directory.`,
        );
      default:
        return new UnknownError(
          `Something went wrong while deleting remote dirpath at ${path}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default rmDir;
