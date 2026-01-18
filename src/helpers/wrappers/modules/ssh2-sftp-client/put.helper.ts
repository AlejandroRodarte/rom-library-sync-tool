import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import FileIOBadCredentialsError from "../../../../classes/errors/file-io-bad-credentials-error.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOExistsError from "../../../../classes/errors/file-io-exists-error.class.js";

export type PutError =
  | UnknownError
  | FileIOConnectionError
  | FileIOBadCredentialsError
  | FileIOBadPathError
  | FileIOUnauthorizedError
  | FileIOBadTypeError
  | FileIOExistsError;

const put = async (
  client: Client,
  ...args: Parameters<typeof client.put>
): Promise<PutError | undefined> => {
  const [localFilePath, remoteFilePath] = args;

  try {
    await client.put(...args);
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e)) {
      let message = `Something bad happened while putting content in remote filepath ${remoteFilePath}. `;
      if (typeof localFilePath === "string")
        message += `Content came from local filepath ${localFilePath}.`;
      return new UnknownError(message);
    }

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new FileIOConnectionError(
          `Your client is not connected. Remote file path ${remoteFilePath} can not be accessed.`,
        );
      case "ERR_BAD_AUTH":
        return new FileIOBadCredentialsError(
          `Credentials for this client failed authentication. Remote file path ${remoteFilePath} can not be accessed.`,
        );
      case "ERR_BAD_PATH":
        return new FileIOBadPathError(
          `Remote file path ${remoteFilePath} is faulty.`,
        );
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is NOT authorized to put content on remote file path ${remoteFilePath}.`,
        );
      case "EISDIR":
        return new FileIOBadTypeError(
          `Remote file path ${remoteFilePath} is a directory, NOT a file.`,
        );
      case "EEXIST":
        return new FileIOExistsError(
          `Remote file path ${remoteFilePath} already exists. Will NOT replace it.`
        )
      default: {
        let message = `Something went bad while trying to put content in remote filepath ${remoteFilePath}. Error code ${e.code}. Error message: ${e.message}. `;
        if (typeof localFilePath === "string")
          message += `Content came from local filepath at ${localFilePath}.`;
        return new UnknownError(message);
      }
    }
  }
};

export default put;
