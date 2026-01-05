import Client from "ssh2-sftp-client";

import type { SftpCredentials } from "../../types.js";

const connect = async (
  client: Client,
  credentials: SftpCredentials,
): Promise<Error | undefined> => {
  try {
    await client.connect(credentials);
  } catch (e: unknown) {
    if (e instanceof Error) return e;
    else return new Error("connect(): an unknown error has occured.");
  }
};

export default connect;
