import Client from "ssh2-sftp-client";
import type { SftpCredentials } from "../types.js";
import sftp from "../helpers/sftp/index.js";
import type { AddFileError } from "../helpers/sftp/add-file.helper.js";
import type { DeleteFileError } from "../helpers/sftp/delete-file.helper.js";
import SftpConnectionError from "./errors/sftp-connection-error.class.js";
import type { ConnectError } from "../helpers/sftp/connect.helper.js";
import SftpDisconnectionError from "./errors/sftp-disconnection-error.class.js";
import type { DisconnectError } from "../helpers/sftp/disconnect.helper.js";
import type { ExistsError } from "../helpers/sftp/exists.helper.js";

export type ConnectMethodError = SftpConnectionError | ConnectError;
export type DisconnectMethodError = SftpDisconnectionError | DisconnectError;
export type AddFileMethodError = AddFileError;
export type DeleteFileMethodError = DeleteFileError;
export type FileExistsMethodError = ExistsError;
export type DirExistsMethodError = ExistsError;

class SftpClient {
  private _client: Client;
  private _connected = false;

  constructor(name: string) {
    this._client = new Client(name);
  }

  public async connect(
    credentials: SftpCredentials,
  ): Promise<ConnectMethodError | undefined> {
    if (this._connected)
      return new SftpConnectionError(
        "This client is already connected to a remote device.",
      );

    const connectionError = await sftp.connect(this._client, credentials);
    if (connectionError) return connectionError;

    this._connected = true;
  }

  public async disconnect(): Promise<DisconnectMethodError | undefined> {
    if (!this._connected)
      return new SftpDisconnectionError(
        "This client is not connected to a remote device.",
      );

    const disconnectionError = await sftp.disconnect(this._client);
    if (disconnectionError) return disconnectionError;

    this._connected = false;
  }

  public async fileExists(
    filePath: string,
  ): Promise<FileExistsMethodError | undefined> {
    const existsError = await sftp.exists(this._client, filePath, "file");
    if (existsError) return existsError;
  }

  public async dirExists(
    dirPath: string,
  ): Promise<DirExistsMethodError | undefined> {
    const existsError = await sftp.exists(this._client, dirPath, "dir");
    if (existsError) return existsError;
  }

  public async addFile(
    localFilePath: string,
    remoteFilePath: string,
    strategy: "REPLACE" | "KEEP",
  ): Promise<AddFileMethodError | undefined> {
    const addError = await sftp.addFile(
      this._client,
      localFilePath,
      remoteFilePath,
      strategy,
    );
    if (addError) return addError;
  }

  public async deleteFile(
    remoteFilePath: string,
    fileMustExist = false,
  ): Promise<DeleteFileMethodError | undefined> {
    const deleteError = await sftp.deleteFile(
      this._client,
      remoteFilePath,
      fileMustExist,
    );
    if (deleteError) return deleteError;
  }
}

export default SftpClient;
