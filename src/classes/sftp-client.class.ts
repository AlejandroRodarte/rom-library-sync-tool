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

  public async fileExists(filePath: string): Promise<Error | undefined> {
    const existsError = await sftp.exists(this._client, filePath, "file");
    if (existsError) return existsError;
  }

  public async dirExists(dirPath: string): Promise<Error | undefined> {
    const existsError = await sftp.exists(this._client, dirPath, "dir");
    if (existsError) return existsError;
  }

  public async addFile(
    localFilePath: string,
    remoteFilePath: string,
  ): Promise<Error | undefined> {
    const addError = await sftp.addFile(
      this._client,
      localFilePath,
      remoteFilePath,
    );
    if (addError) return addError;
  }

  public async deleteFile(
    remoteFilePath: string,
    fileMustExist = false,
  ): Promise<Error | undefined> {
    const deleteError = await sftp.deleteFile(
      this._client,
      remoteFilePath,
      fileMustExist,
    );
    if (deleteError) return deleteError;
  }
}

export default SftpClient;
