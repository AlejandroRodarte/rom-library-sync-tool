import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import SftpConnectionError from "../../../../classes/errors/sftp-connection-error.class.js";
import SftpBadCredentialsError from "../../../../classes/errors/sftp-bad-credentials.class.js";
import SftpBadPathError from "../../../../classes/errors/sftp-bad-path.class.js";
import SftpUnauthorizedError from "../../../../classes/errors/sftp-unauthorized-error.class.js";
import SftpWrongTypeError from "../../../../classes/errors/sftp-wrong-type-error.class.js";

export type ListError =
  | UnknownError
  | SftpConnectionError
  | SftpBadCredentialsError
  | SftpBadPathError
  | SftpUnauthorizedError
  | SftpWrongTypeError;

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
          new SftpConnectionError(
            `Client is not connected. Unable to reach remote path ${remoteDirPath}.`,
          ),
        ];
      case "ERR_BAD_AUTH":
        return [
          undefined,
          new SftpBadCredentialsError(
            `Client suffers from bad/faulty authentication and credentials.`,
          ),
        ];
      case "ERR_BAD_PATH":
        return [
          undefined,
          new SftpBadPathError(`Remote path ${remoteDirPath} is faulty.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new SftpUnauthorizedError(
            `Remote path ${remoteDirPath} exists, but this process lacks the privileges to access it.`,
          ),
        ];
      case "ENOTDIR":
        return [
          undefined,
          new SftpWrongTypeError(
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
