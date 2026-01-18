import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentials from "../../../../classes/errors/file-io-bad-credentials.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";

export type ListError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentials
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOBadTypeError
  | FileIONotFoundError;

const list = async (
  client: Client,
  ...args: Parameters<typeof client.list>
): Promise<
  [Awaited<ReturnType<typeof client.list>>, undefined] | [undefined, ListError]
> => {
  const [remoteDirPath] = args;

  try {
    const entries = await client.list(...args);
    return [entries, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error happened while trying to fetch content from remote dirpath at ${remoteDirPath}.`,
        ),
      ];

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return [
          undefined,
          new FileIOConnectionError(
            `Client is not connected. Unable to reach remote path ${remoteDirPath}.`,
          ),
        ];
      case "ERR_BAD_AUTH":
        return [
          undefined,
          new FileIOBadCredentials(
            `Client suffers from bad/faulty authentication and credentials.`,
          ),
        ];
      case "ERR_BAD_PATH":
        return [
          undefined,
          new FileIOBadPathError(`Remote path ${remoteDirPath} is faulty.`),
        ];
      case "ENOENT":
        return [
          undefined,
          new FileIONotFoundError(`Remote path ${remoteDirPath} does not exist.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `Remote path ${remoteDirPath} exists, but this process lacks the privileges to access it.`,
          ),
        ];
      case "ENOTDIR":
        return [
          undefined,
          new FileIOBadTypeError(
            `Remote path ${remoteDirPath} points to a file, NOT a directory.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something went wrong while trying to fetch content from remote dirpath at ${remoteDirPath}. Error code: ${e.code}. Error message: ${e.message}.`,
          ),
        ];
    }
  }
};

export default list;
