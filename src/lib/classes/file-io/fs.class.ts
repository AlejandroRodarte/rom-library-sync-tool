import type { FileIOLsEntry } from "../../interfaces/file-io-ls-entry.interface.js";
import type {
  FileIO,
  AddMethodError,
  DeleteMethodError,
  ExistsMethodError,
  LsMethodError,
  AddFileTypePayload,
  DeleteFileTypePayload,
  DeleteFilePayloadOpts,
  DeleteDirPayloadOpts,
  AddFilePayloadOpts,
  AddDirPayloadOpts,
  ExistsMethodResult,
  GetMethodError,
} from "../../interfaces/file-io.interface.js";
import exists from "../../helpers/extras/fs/exists.helper.js";
import ls from "../../helpers/extras/fs/ls.helper.js";
import deleteFile from "../../helpers/extras/fs/delete-file.helper.js";
import deleteSymlink from "../../helpers/extras/fs/delete-symlink.helper.js";
import deleteDir from "../../helpers/extras/fs/delete-dir.helper.js";
import copyFile from "../../helpers/extras/fs/copy-file.helper.js";
import createSymlink from "../../helpers/extras/fs/create-symlink.helper.js";
import copyDir from "../../helpers/extras/fs/copy-dir.helper.js";
import type { FileOrDir } from "../../types/file-or-dir.type.js";
import { DIR, FILE } from "../../constants/fs/fs-types.constants.js";
import type { FsType } from "../../types/fs-type.type.js";
import type { RightsForValidation } from "../../types/rights/rights-for-validation.type.js";
import {
  COPY,
  SYMLINK,
} from "../../constants/file-io/file-io-fs-crud-strategies.constants.js";
import type { FileIOFsCrudStrategy } from "../../types/file-io/file-io-fs-crud-strategy.type.js";

const fsExtras = {
  exists,
  ls,
  deleteFile,
  deleteSymlink,
  deleteDir,
};

class Fs implements FileIO {
  private _crudMode: FileIOFsCrudStrategy;

  constructor(crudMode: FileIOFsCrudStrategy) {
    this._crudMode = crudMode;
  }

  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, LsMethodError]> =
    async (dirPath: string) => {
      return await fsExtras.ls(dirPath);
    };

  get: (
    type: FileOrDir,
    paths: { src: string; dst: string },
  ) => Promise<GetMethodError | undefined> = async (type, paths) => {
    switch (type) {
      case FILE: {
        const copyFileError = await copyFile(paths.src, paths.dst, {
          overwrite: true,
        });
        if (copyFileError) return copyFileError;
        break;
      }
      case DIR: {
        const copyDirError = await copyDir(paths.src, paths.dst, {
          overwrite: true,
          recursive: true,
        });
        if (copyDirError) return copyDirError;
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
    return await fsExtras.exists(type, path, rights);
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

        switch (this._crudMode) {
          case COPY: {
            const copyFileError = await copyFile(
              fileTypePayload.srcPath,
              fileTypePayload.dstPath,
              addFileOpts,
            );
            if (copyFileError) return copyFileError;
            break;
          }
          case SYMLINK: {
            const createSymlinkError = await createSymlink(
              FILE,
              fileTypePayload.srcPath,
              fileTypePayload.dstPath,
              addFileOpts,
            );
            if (createSymlinkError) return createSymlinkError;
            break;
          }
        }
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

        switch (this._crudMode) {
          case COPY: {
            const copyDirError = await copyDir(
              fileTypePayload.srcPath,
              fileTypePayload.dstPath,
              addDirOpts,
            );
            if (copyDirError) return copyDirError;
            break;
          }
          case SYMLINK: {
            const createSymlinkError = await createSymlink(
              DIR,
              fileTypePayload.srcPath,
              fileTypePayload.dstPath,
              addDirOpts,
            );
            if (createSymlinkError) return createSymlinkError;
            break;
          }
        }
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

        switch (this._crudMode) {
          case COPY: {
            const deleteFileError = await fsExtras.deleteFile(
              fileTypePayload.path,
              deleteFileOpts,
            );
            if (deleteFileError) return deleteFileError;
            break;
          }
          case SYMLINK: {
            const deleteSymlinkError = await fsExtras.deleteSymlink(
              fileTypePayload.path,
              deleteFileOpts,
            );
            if (deleteSymlinkError) return deleteSymlinkError;
            break;
          }
        }

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

        switch (this._crudMode) {
          case COPY: {
            const deleteDirError = await deleteDir(
              fileTypePayload.path,
              deleteDirOpts,
            );
            if (deleteDirError) return deleteDirError;
            break;
          }
          case SYMLINK: {
            const deleteSymlinkError = await fsExtras.deleteSymlink(
              fileTypePayload.path,
              deleteDirOpts,
            );
            if (deleteSymlinkError) return deleteSymlinkError;
            break;
          }
        }
        break;
      }
    }
  };
}

export default Fs;
