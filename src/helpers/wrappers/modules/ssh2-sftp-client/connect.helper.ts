import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import SftpConnectionError from "../../../../classes/errors/sftp-connection-error.class.js";
import SftpBadCredentialsError from "../../../../classes/errors/sftp-bad-credentials.class.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";

export type ConnectError =
  | SftpConnectionError
  | SftpBadCredentialsError
  | UnknownError;

const connect = async (
  client: Client,
  ...args: Parameters<typeof client.connect>
): Promise<ConnectError | undefined> => {
  const [credentials] = args;

  try {
    await client.connect(...args);
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return new SftpConnectionError(
        `An unknown error happened while connecting via SFTP. Host: ${credentials.host}. Port: ${credentials.port}. Username: ${credentials.username}.`,
      );

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new SftpConnectionError(`Client is not connected.`);
      case "ERR_BAD_AUTH":
        return new SftpBadCredentialsError(
          `Client suffers from bad credentials. Host: ${credentials.host}. Port: ${credentials.port}. Username: ${credentials.username}.`,
        );
      default:
        return new UnknownError(
          `Something went wrong while connecting via SFTP. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default connect;
