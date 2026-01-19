import type { FileIOLsEntry } from "../../interfaces/file-io-ls-entry.interface.js";
import type {
  FileIO,
  AddMethodError,
  DeleteMethodError,
  ExistsMethodError,
  LsMethodError,
  AddFileTypePayload,
  DeleteFileTypePayload,
  ExistsMethodResult,
  AddFilePayloadOpts,
  AddDirPayloadOpts,
  DeleteFilePayloadOpts,
  DeleteDirPayloadOpts,
} from "../../interfaces/file-io.interface.js";
import type SftpClient from "../sftp-client.class.js";

class Sftp implements FileIO {
  private _client: SftpClient;

  constructor(client: SftpClient) {
    this._client = client;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this._client[Symbol.asyncDispose]();
  }

  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, LsMethodError]> =
    async (dirPath: string) => {
      return await this._client.ls(dirPath);
    };

  exists: (
    type: "file" | "dir" | "link",
    path: string,
    rights?: "r" | "w" | "rw",
  ) => Promise<
    [ExistsMethodResult, undefined] | [undefined, ExistsMethodError]
  > = async (type, path, rights) => {
    return await this._client.exists(type, path, rights);
  };

  add: (
    fileTypePayload: AddFileTypePayload,
  ) => Promise<AddMethodError | undefined> = async (fileTypePayload) => {
    switch (fileTypePayload.type) {
      case "file": {
        const addFileOpts: Required<AddFilePayloadOpts> = { overwrite: false };

        if (fileTypePayload.opts)
          if (typeof fileTypePayload.opts.overwrite !== "undefined")
            addFileOpts.overwrite = fileTypePayload.opts.overwrite;

        const addFileError = await this._client.addFileFromFs(
          fileTypePayload.srcPath,
          fileTypePayload.dstPath,
          addFileOpts,
        );

        if (addFileError) return addFileError;

        break;
      }
      case "dir": {
        const addDirOpts: Required<AddDirPayloadOpts> = {
          overwrite: false,
          recursive: true,
        };

        if (fileTypePayload.opts) {
          if (typeof fileTypePayload.opts.overwrite !== "undefined")
            addDirOpts.overwrite = fileTypePayload.opts.overwrite;
          if (typeof fileTypePayload.opts.recursive !== "undefined")
            addDirOpts.overwrite = fileTypePayload.opts.recursive;
        }

        const addDirError = await this._client.addDirFromFs(
          fileTypePayload.srcPath,
          fileTypePayload.dstPath,
          addDirOpts,
        );

        if (addDirError) return addDirError;

        break;
      }
    }
  };

  delete: (
    fileTypePayload: DeleteFileTypePayload,
  ) => Promise<DeleteMethodError | undefined> = async (fileTypePayload) => {
    switch (fileTypePayload.type) {
      case "file": {
        const deleteFileOpts: Required<DeleteFilePayloadOpts> = {
          mustExist: false,
        };

        if (fileTypePayload.opts)
          if (typeof fileTypePayload.opts.mustExist !== "undefined")
            deleteFileOpts.mustExist = fileTypePayload.opts.mustExist;

        const deleteFileError = await this._client.deleteFile(
          fileTypePayload.path,
          deleteFileOpts,
        );

        if (deleteFileError) return deleteFileError;

        break;
      }
      case "dir": {
        const deleteDirOpts: Required<DeleteDirPayloadOpts> = {
          mustExist: false,
          recursive: true,
        };

        if (fileTypePayload.opts) {
          if (typeof fileTypePayload.opts.mustExist !== "undefined")
            deleteDirOpts.mustExist = fileTypePayload.opts.mustExist;
          if (typeof fileTypePayload.opts.recursive !== "undefined")
            deleteDirOpts.recursive = fileTypePayload.opts.recursive;
        }

        const deleteDirError = await this._client.deleteDir(
          fileTypePayload.path,
          deleteDirOpts,
        );

        if (deleteDirError) return deleteDirError;

        break;
      }
    }
  };
}

export default Sftp;
