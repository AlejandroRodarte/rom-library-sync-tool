import Client from "ssh2-sftp-client";
import type { SftpCredentials } from "../types.js";
import sftp from "../helpers/sftp/index.js";

class SftpClient {
  private _client: Client;
  private _connected = false;

  constructor(name: string) {
    this._client = new Client(name);
  }

  public async connect(credentials: SftpCredentials): Promise<void> {
    if (this._connected) {
      console.log(
        "This client is already connected to a remote device. Build a new SftpClient object to connect to another device.",
      );
      return;
    }

    const connectionError = await sftp.connect(this._client, credentials);

    if (connectionError) {
      console.log(
        "Failed to connect to remote device. This client remains uninitialized",
      );
      return;
    }

    this._connected = true;
  }

  public async disconnect(): Promise<void> {
    if (!this._connected) {
      console.log(
        "This client is not connected to a remote device. Doing nothing.",
      );
      return;
    }

    const disconnectionError = await sftp.disconnect(this._client);

    if (disconnectionError) {
      console.log(
        "Failed to disconnect from remote device. This client remains initialized.",
      );
    }

    this._connected = false;
  }
}

export default SftpClient;
