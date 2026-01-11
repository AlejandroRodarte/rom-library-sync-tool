import Client from "ssh2-sftp-client";
import SftpConnectionError from "../../classes/errors/sftp-connection-error.class.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import SftpWrongTypeError from "../../classes/errors/sftp-wrong-type-error.class.js";
import typeGuards from "../typescript/guards/index.js";
import SftpBadPathError from "../../classes/errors/sftp-bad-path.class.js";
import SftpUnauthorizedError from "../../classes/errors/sftp-unauthorized-error.class.js";
import SftpBadCredentialsError from "../../classes/errors/sftp-bad-credentials.class.js";

export type ExistsError =
  | UnknownError
  | SftpNotFoundError
  | SftpWrongTypeError
  | SftpConnectionError
  | SftpBadCredentialsError
  | SftpBadPathError
  | SftpUnauthorizedError;

const exists = async (
  client: Client,
  remotePath: string,
  type: "file" | "dir" | "link",
): Promise<ExistsError | undefined> => {
  try {
    const result = await client.exists(remotePath);
    if (result === false)
      return new SftpNotFoundError(`Remote path ${remotePath} does not exist.`);

    switch (type) {
      case "file":
        if (result !== "-")
          return new SftpWrongTypeError(
            `Object exists in remote path ${remotePath}, but it is NOT a file.`,
          );
        break;
      case "dir":
        if (result !== "d")
          return new SftpWrongTypeError(
            `Object exists in remote path ${remotePath}, but it is NOT a directory.`,
          );
        break;
      case "link":
        if (result !== "l")
          return new SftpWrongTypeError(
            `Object exists in remote path ${remotePath}, but it is NOT a link.`,
          );
        break;
      default:
        return new SftpWrongTypeError("Unsupported file type.");
    }
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return new UnknownError(
        `An unknown error happened while accessing remote path ${remotePath}. File type to check: ${type}.`,
      );

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new SftpConnectionError(
          `Client is not connected. Unable to reach remote path ${remotePath}.`,
        );
      case "ERR_BAD_AUTH":
        return new SftpBadCredentialsError(
          `Client suffers from bad/faulty authentication and credentials.`,
        );
      case "ERR_BAD_PATH":
        return new SftpBadPathError(`Remote path ${remotePath} is faulty.`);
      case "EACCES":
      case "EPERM":
        return new SftpUnauthorizedError(
          `Remote path ${remotePath} exists, but this process lacks the privileges to access it.`,
        );
      default:
        return new UnknownError(
          `Something wrong happened while accessing remote path ${remotePath}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default exists;
