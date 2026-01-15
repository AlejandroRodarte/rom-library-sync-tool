import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import SftpConnectionError from "../../../../classes/errors/sftp-connection-error.class.js";
import SftpBadCredentialsError from "../../../../classes/errors/sftp-bad-credentials.class.js";
import SftpBadPathError from "../../../../classes/errors/sftp-bad-path.class.js";
import SftpUnauthorizedError from "../../../../classes/errors/sftp-unauthorized-error.class.js";
import SftpWrongTypeError from "../../../../classes/errors/sftp-wrong-type-error.class.js";

export type PutError =
  | UnknownError
  | SftpConnectionError
  | SftpBadCredentialsError
  | SftpBadPathError
  | SftpUnauthorizedError
  | SftpWrongTypeError;

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
        return new SftpConnectionError(
          `Your client is not connected. Remote file path ${remoteFilePath} can not be accessed.`,
        );
      case "ERR_BAD_AUTH":
        return new SftpBadCredentialsError(
          `Credentials for this client failed authentication. Remote file path ${remoteFilePath} can not be accessed.`,
        );
      case "ERR_BAD_PATH":
        return new SftpBadPathError(
          `Remote file path ${remoteFilePath} is faulty.`,
        );
      case "EACCES":
      case "EPERM":
        return new SftpUnauthorizedError(
          `This process is NOT authorized to put content on remote file path ${remoteFilePath}.`,
        );
      case "EISDIR":
        return new SftpWrongTypeError(
          `Remote file path ${remoteFilePath} is a directory, NOT a file.`,
        );
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
