import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentialsError from "../../../../classes/errors/file-io-bad-credentials-error.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";

export type GetError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIONotFoundError
  | FileIOBadTypeError;

const get = async (
  client: Client,
  ...args: Parameters<typeof client.get>
): Promise<
  [Awaited<ReturnType<typeof client.get>>, undefined] | [undefined, GetError]
> => {
  const [srcPath] = args;

  try {
    const result = await client.get(...args);
    return [result, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error happened while fetching remote file at ${srcPath}.`,
        ),
      ];

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return [
          undefined,
          new FileIOConnectionError(
            `Client is not connected. Unable to reach remote path ${srcPath}.`,
          ),
        ];
      case "ERR_BAD_AUTH":
        return [
          undefined,
          new FileIOBadCredentialsError(
            `Client suffers from bad/faulty authentication and credentials.`,
          ),
        ];
      case "ERR_BAD_PATH":
        return [
          undefined,
          new FileIOBadPathError(`Remote path ${srcPath} is faulty.`),
        ];
      case "ENOENT":
        return [
          undefined,
          new FileIONotFoundError(
            `Source remote path ${srcPath} does not exist.`,
          ),
        ];
      case "EISDIR":
        return [
          undefined,
          new FileIOBadTypeError(
            `Source remote path ${srcPath} is a file, NOT a directory.`,
          ),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `Remote path ${srcPath} exists, but this process lacks the privileges to access it.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `An unknown error happened while getting file from remote path ${srcPath}. Error code: ${e.code}. Error message: ${e.message}.`,
          ),
        ];
    }
  }
};

export default get;
