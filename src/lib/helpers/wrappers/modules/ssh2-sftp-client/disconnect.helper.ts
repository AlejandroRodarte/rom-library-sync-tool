import Client from "ssh2-sftp-client";
import typeGuards from "../../../typescript/guards/index.js";
import FileIODisconnectionError from "../../../../classes/errors/file-io-disconnection-error.class.js";
import FileIOConnectionError from "../../../../classes/errors/file-io-connection-error.class.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";

export type DisconnectError =
  | FileIODisconnectionError
  | FileIOConnectionError
  | UnknownError;

const disconnect = async (
  client: Client,
): Promise<DisconnectError | undefined> => {
  try {
    await client.end();
  } catch (e: unknown) {
    if (!typeGuards.isSftpError(e))
      return new FileIODisconnectionError(
        `An unknown error happened while disconnecting from the SFTP client.`,
      );

    switch (e.code) {
      case "ERR_NOT_CONNECTED":
        return new FileIOConnectionError(
          "This client is not even connected. Idiot.",
        );
      default:
        return new UnknownError(
          `Something bad happened while trying to disconnect. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default disconnect;
