import Client from "ssh2-sftp-client";
import FileIOConnectionError from "./errors/file-io-connection-error.class.js";
import FileIODisconnectionError from "./errors/file-io-disconnection-error.class.js";
import type { SftpCredentials } from "../interfaces/sftp-credentials.interface.js";
import connect, {
  type ConnectError,
} from "../helpers/wrappers/modules/ssh2-sftp-client/connect.helper.js";
import disconnect, {
  type DisconnectError,
} from "../helpers/wrappers/modules/ssh2-sftp-client/disconnect.helper.js";
import list, {
  type ListError,
} from "../helpers/wrappers/modules/ssh2-sftp-client/list.helper.js";
import access, {
  type AccessError,
} from "../helpers/extras/sftp/access.helper.js";
import fileExists, {
  type FileExistsError,
} from "../helpers/extras/sftp/file-exists.helper.js";
import dirExists, {
  type DirExistsError,
} from "../helpers/extras/sftp/dir-exists.helper.js";
import deleteFile, {
  type DeleteFileError,
} from "../helpers/extras/sftp/delete-file.helper.js";
import addFile, {
  type AddFileError,
} from "../helpers/extras/sftp/add-file.helper.js";
import FileIONotFoundError from "./errors/file-io-not-found-error.class.js";

export type ConnectMethodError = ConnectError;
export type DisconnectMethodError = DisconnectError;
export type AddFileMethodError = AddFileError;
export type DeleteFileMethodError = DeleteFileError;
export type FileExistsMethodError = FileExistsError;
export type DirExistsMethodError = DirExistsError;
export type AllDirsExistMethodError = DirExistsMethodError;
export type ListMethodError = ListError;
export type ExistsMethodError = AccessError;

const sftpExtras = {
  access,
  fileExists,
  dirExists,
  addFile,
  deleteFile,
};

class SftpClient {
  private _credentials: SftpCredentials;
  private _client: Client;
  private _connected = false;

  constructor(name: string, credentials: SftpCredentials) {
    this._credentials = credentials;
    this._client = new Client(name);
  }

  get connected() {
    return this._connected;
  }

  public async connect(): Promise<ConnectMethodError | undefined> {
    if (this._connected)
      return new FileIOConnectionError(
        "This client is already connected to a remote device.",
      );

    const connectionError = await connect(this._client, this._credentials);
    if (connectionError) return connectionError;

    this._connected = true;
  }

  public async disconnect(): Promise<DisconnectMethodError | undefined> {
    if (!this._connected)
      return new FileIODisconnectionError(
        "This client is not connected to a remote device.",
      );

    const disconnectionError = await disconnect(this._client);
    if (disconnectionError) return disconnectionError;

    this._connected = false;
  }

  public async list(
    remoteDirPath: string,
  ): Promise<[Client.FileInfo[], undefined] | [undefined, ListMethodError]> {
    const [entries, listError] = await list(this._client, remoteDirPath);
    if (listError) return [undefined, listError];
    return [entries, undefined];
  }

  public async exists(
    type: "file" | "dir" | "link",
    path: string,
    mode?: number,
  ): Promise<ExistsMethodError | undefined> {
    const accessError = await sftpExtras.access(this._client, type, path, mode);
    if (accessError) return accessError;
  }

  public async fileExists(
    filePath: string,
  ): Promise<FileExistsMethodError | undefined> {
    const existsError = await sftpExtras.fileExists(this._client, filePath);
    if (existsError) return existsError;
  }

  public async dirExists(
    dirPath: string,
  ): Promise<DirExistsMethodError | undefined> {
    const existsError = await sftpExtras.dirExists(this._client, dirPath);
    if (existsError) return existsError;
  }

  public async allDirsExist(
    dirPaths: string[],
  ): Promise<[boolean, undefined] | [undefined, AllDirsExistMethodError]> {
    let allDirsExist = true;

    for (const dirPath of dirPaths) {
      const existsError = await this.dirExists(dirPath);

      if (existsError) {
        if (existsError instanceof FileIONotFoundError) {
          allDirsExist = false;
          break;
        } else return [undefined, existsError];
      }
    }

    return [allDirsExist, undefined];
  }

  public async addFile(
    localFilePath: string,
    remoteFilePath: string,
    strategy: "REPLACE" | "KEEP",
  ): Promise<AddFileMethodError | undefined> {
    const addError = await sftpExtras.addFile(
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
    const deleteError = await sftpExtras.deleteFile(
      this._client,
      remoteFilePath,
      fileMustExist,
    );
    if (deleteError) return deleteError;
  }
}

export default SftpClient;
