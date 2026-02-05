import Client from "ssh2-sftp-client";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import typeGuards from "../../../typescript/guards/index.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentialsError from "../../../../classes/errors/file-io-bad-credentials-error.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";

export type DownloadDirError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | FileIOBadPathError
  | FileIOBadTypeError
  | FileIONotFoundError
  | FileIOUnauthorizedError;

const downloadDir = async (
  client: Client,
  ...args: Parameters<typeof client.downloadDir>
): Promise<
  | [Awaited<ReturnType<typeof client.downloadDir>>, undefined]
  | [undefined, DownloadDirError]
> => {
  const [srcDir] = args;

  try {
    const result = await client.downloadDir(...args);
    return [result, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error happened while trying to download remote directory at ${srcDir}.`,
        ),
      ];

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return [
          undefined,
          new FileIOConnectionError(
            `Client is not connected. Unable to reach remote path ${srcDir}.`,
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
          new FileIOBadPathError(`Remote path ${srcDir} is faulty.`),
        ];
      case "ENOENT":
        return [
          undefined,
          new FileIONotFoundError(`Source dir path ${srcDir} does not exist`),
        ];
      case "ENOTDIR":
        return [
          undefined,
          new FileIOBadTypeError(`Source path ${srcDir} is NOT a directory.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `Remote path ${srcDir} exists, but this process lacks the privileges to access it.`,
          ),
        ];

      default:
        return [
          undefined,
          new UnknownError(
            `Something went wrong while downloading directory from remote path at ${srcDir}. Error code: ${e.code}. Error message: ${e.message}.`,
          ),
        ];
    }
  }
};

export default downloadDir;
