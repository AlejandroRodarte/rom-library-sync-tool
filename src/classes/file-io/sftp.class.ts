import { DIR, FILE } from "../../constants/fs-types.constants.js";
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
  GetMethodError,
  GetMethodOpts,
} from "../../interfaces/file-io.interface.js";
import type { FileOrDir } from "../../types/file-or-dir.type.js";
import type { FsType } from "../../types/fs-type.type.js";
import type { RightsForValidation } from "../../types/rights-for-validation.type.js";
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

  get: (
    type: FileOrDir,
    paths: { src: string; dst: string },
    opts?: GetMethodOpts,
  ) => Promise<GetMethodError | undefined> = async (type, paths, opts) => {
    switch (type) {
      case FILE: {
        const downloadFileError = await this._client.downloadFileToFs(
          paths.src,
          paths.dst,
          opts,
        );
        if (downloadFileError) return downloadFileError;
        break;
      }
      case DIR: {
        const downloadDirError = await this._client.downloadDirToFs(
          paths.src,
          paths.dst,
          opts,
        );
        if (downloadDirError) return downloadDirError;
        break;
      }
    }
  };

  exists: (
    type: FsType,
    path: string,
    rights?: RightsForValidation,
  ) => Promise<
    [ExistsMethodResult, undefined] | [undefined, ExistsMethodError]
  > = async (type, path, rights) => {
    return await this._client.exists(type, path, rights);
  };

  add: (
    fileTypePayload: AddFileTypePayload,
  ) => Promise<AddMethodError | undefined> = async (fileTypePayload) => {
    switch (fileTypePayload.type) {
      case FILE: {
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
      case DIR: {
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
      case FILE: {
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
      case DIR: {
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
