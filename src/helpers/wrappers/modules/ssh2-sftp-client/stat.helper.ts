import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import SftpConnectionError from "../../../../classes/errors/sftp-connection-error.class.js";
import SftpBadCredentialsError from "../../../../classes/errors/sftp-bad-credentials.class.js";
import SftpBadPathError from "../../../../classes/errors/sftp-bad-path.class.js";
import SftpUnauthorizedError from "../../../../classes/errors/sftp-unauthorized-error.class.js";
import SftpNotFoundError from "../../../../classes/errors/sftp-not-found-error.class.js";

export type StatError =
  | UnknownError
  | SftpConnectionError
  | SftpBadCredentialsError
  | SftpBadPathError
  | SftpUnauthorizedError
  | SftpNotFoundError;

const stat = async (
  client: Client,
  ...args: Parameters<typeof client.stat>
): Promise<
  [Awaited<ReturnType<typeof client.stat>>, undefined] | [undefined, StatError]
> => {
  const [remotePath] = args;

  try {
    const stats = await client.stat(...args);
    return [stats, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error happened while fetching stats from remote path at ${remotePath}.`,
        ),
      ];

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return [
          undefined,
          new SftpConnectionError(
            `Client is not connected. Unable to reach remote path ${remotePath}.`,
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
          new SftpBadPathError(`Remote path ${remotePath} is faulty.`),
        ];
      case "ENOENT":
        return [
          undefined,
          new SftpNotFoundError(`Remote path ${remotePath} does not exist.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new SftpUnauthorizedError(
            `Remote path ${remotePath} exists, but this process lacks the privileges to fetch its stats.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something went wrong while trying to fetch stats about remote path at ${remotePath}. Error code: ${e.code}. Error message: ${e.message}.`,
          ),
        ];
    }
  }
};

export default stat;
