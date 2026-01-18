import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentials from "../../../../classes/errors/file-io-bad-credentials.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";

export type ExistsError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentials
  | FileIOBadPathError
  | FileIOUnauthorizedError;

const exists = async (
  client: Client,
  ...args: Parameters<typeof client.exists>
): Promise<
  | [Awaited<ReturnType<typeof client.exists>>, undefined]
  | [undefined, ExistsError]
> => {
  const [remotePath] = args;

  try {
    const result = await client.exists(...args);
    return [result, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error happened while accessing remote path ${remotePath}.`,
        ),
      ];

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return [
          undefined,
          new FileIOConnectionError(
            `Client is not connected. Unable to reach remote path ${remotePath}.`,
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
          new FileIOBadPathError(`Remote path ${remotePath} is faulty.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `Remote path ${remotePath} exists, but this process lacks the privileges to access it.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something wrong happened while accessing remote path ${remotePath}. Error code: ${e.code}. Error message: ${e.message}.`,
          ),
        ];
    }
  }
};

export default exists;
