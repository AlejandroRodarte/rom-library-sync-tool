import Client from "ssh2-sftp-client";
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
import logger from "../objects/logger.object.js";
import exists, {
  type ExistsError,
} from "../helpers/extras/sftp/exists.helper.js";
import ls, { type LsError } from "../helpers/extras/sftp/ls.helper.js";
import type { FileIOLsEntry } from "../interfaces/file-io-ls-entry.interface.js";
import type { ExistsMethodResult } from "../interfaces/file-io.interface.js";
import copyFileFromFs, {
  type CopyFileFromFsError,
} from "../helpers/extras/sftp/copy-file-from-fs.helper.js";
import copyDirFromFs, {
  type CopyDirFromFsError,
} from "../helpers/extras/sftp/copy-dir-from-fs.helper.js";
import deleteFile, {
  type DeleteFileError,
} from "../helpers/extras/sftp/delete-file.helper.js";
import deleteDir, {
  type DeleteDirError,
} from "../helpers/extras/sftp/delete-dir.gelper.js";

const sftpExtras = {
  access,
  exists,
  ls,
  copyFileFromFs,
  copyDirFromFs,
  deleteFile,
  deleteDir,
};

type ConnectMethodError = ConnectError;
type DisconnectMethodError = DisconnectError;

type TryConnectMethodError = ConnectMethodError;

export type ListMethodError = ListError | TryConnectMethodError;
export type LsMethodError = LsError | TryConnectMethodError;
export type AccessMethodError = AccessError | TryConnectMethodError;
export type ExistsMethodError = ExistsError | TryConnectMethodError;

export type AddFileFromFsMethodError =
  | CopyFileFromFsError
  | TryConnectMethodError;
export type DeleteFileMethodError = DeleteFileError | TryConnectMethodError;
export type AddDirFromFsMethodError =
  | CopyDirFromFsError
  | TryConnectMethodError;
export type DeleteDirMethodError = DeleteDirError | TryConnectMethodError;

export interface AddFileFromFsMethodOpts {
  overwrite?: boolean;
}

export interface DeleteFileMethodOpts {
  mustExist?: boolean;
}

export interface AddDirFromFsMethodOpts {
  overwrite?: boolean;
  recursive?: boolean;
}

export interface DeleteDirMethodOpts {
  mustExist?: boolean;
  recursive?: boolean;
}

class SftpClient {
  private _name: string;
  private _credentials: SftpCredentials;
  private _client: Client;
  private _connected = false;

  constructor(name: string, credentials: SftpCredentials) {
    this._name = name;
    this._credentials = credentials;
    this._client = new Client(name);
  }

  async [Symbol.asyncDispose](): Promise<void> {
    const disconnectError = await this._disconnect();
    if (disconnectError) logger.fatal(disconnectError.toString());
  }

  get connected() {
    return this._connected;
  }

  public async list(
    path: string,
  ): Promise<[Client.FileInfo[], undefined] | [undefined, ListMethodError]> {
    const connectionError = await this._tryConnect();
    if (connectionError) return [undefined, connectionError];

    const [fileList, listError] = await list(this._client, path);

    if (listError) return [undefined, listError];
    return [fileList, listError];
  }

  public async ls(
    path: string,
  ): Promise<[FileIOLsEntry[], undefined] | [undefined, LsMethodError]> {
    const [lsEntries, lsError] = await sftpExtras.ls(this._client, path);
    if (lsError) return [undefined, lsError];
    return [lsEntries, undefined];
  }

  public async access(
    type: "file" | "dir" | "link",
    path: string,
    mode?: number,
  ): Promise<AccessMethodError | undefined> {
    const connectionError = await this._tryConnect();
    if (connectionError) return connectionError;

    const accessError = await sftpExtras.access(this._client, type, path, mode);
    return accessError;
  }

  public async exists(
    type: "file" | "dir" | "link",
    path: string,
    rights?: "r" | "w" | "rw",
  ): Promise<[ExistsMethodResult, undefined] | [undefined, ExistsError]> {
    const connectionError = await this._tryConnect();
    if (connectionError) return [undefined, connectionError];

    const [existsResult, existsError] = await sftpExtras.exists(
      this._client,
      type,
      path,
      rights,
    );

    if (existsError) return [undefined, existsError];
    return [existsResult, undefined];
  }

  public async addFileFromFs(
    srcFilePath: string,
    dstFilePath: string,
    opts?: AddFileFromFsMethodOpts,
  ): Promise<AddFileFromFsMethodError | undefined> {
    const connectionError = await this._tryConnect();
    if (connectionError) return connectionError;

    const copyFileError = await sftpExtras.copyFileFromFs(
      this._client,
      srcFilePath,
      dstFilePath,
      opts,
    );

    if (copyFileError) return copyFileError;
  }

  public async addDirFromFs(
    srcDirPath: string,
    dstDirPath: string,
    opts?: AddDirFromFsMethodOpts,
  ): Promise<AddDirFromFsMethodError | undefined> {
    const connectionError = await this._tryConnect();
    if (connectionError) return connectionError;

    const copyDirError = await sftpExtras.copyDirFromFs(
      this._client,
      srcDirPath,
      dstDirPath,
      opts,
    );

    if (copyDirError) return copyDirError;
  }

  public async deleteFile(
    filePath: string,
    opts?: DeleteFileMethodOpts,
  ): Promise<DeleteFileMethodError | undefined> {
    const connectionError = await this._tryConnect();
    if (connectionError) return connectionError;

    const deleteFileError = await sftpExtras.deleteFile(
      this._client,
      filePath,
      opts,
    );
    if (deleteFileError) return deleteFileError;
  }

  public async deleteDir(
    dirPath: string,
    opts?: DeleteDirMethodOpts,
  ): Promise<DeleteDirMethodError | undefined> {
    const connectionError = await this._tryConnect();
    if (connectionError) return connectionError;

    const deleteDirError = await sftpExtras.deleteDir(
      this._client,
      dirPath,
      opts,
    );
    if (deleteDirError) return deleteDirError;
  }

  private async _connect(): Promise<ConnectMethodError | undefined> {
    if (this._connected) {
      logger.warn(
        `This SFTP client is already connected to device ${this._name}.`,
      );
      return undefined;
    }

    const connectionError = await connect(this._client, this._credentials);
    if (connectionError) return connectionError;

    this._connected = true;
  }

  private async _disconnect(): Promise<DisconnectMethodError | undefined> {
    if (!this._connected) {
      logger.warn(
        `This SFTP client is not connected to remote device ${this._name}.`,
      );
      return undefined;
    }

    const disconnectionError = await disconnect(this._client);
    if (disconnectionError) return disconnectionError;

    this._connected = false;
  }

  private async _tryConnect(): Promise<TryConnectMethodError | undefined> {
    if (this._connected) return undefined;
    const connectionError = await this._connect();
    if (connectionError) return connectionError;
  }
}

export default SftpClient;
