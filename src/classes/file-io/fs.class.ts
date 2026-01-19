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
} from "../../interfaces/file-io.interface.js";
import type { FileIOFsCrudStrategy } from "../../types/file-io-fs-crud-strategy.type.js";
import exists from "../../helpers/extras/fs/exists.helper.js";
import ls from "../../helpers/extras/fs/ls.helper.js";
import deleteFile from "../../helpers/extras/fs/delete-file.helper.js";
import deleteSymlink from "../../helpers/extras/fs/delete-symlink.helper.js";
import deleteDir from "../../helpers/extras/fs/delete-dir.helper.js";
import copyFile from "../../helpers/extras/fs/copy-file.helper.js";
import createSymlink from "../../helpers/extras/fs/create-symlink.helper.js";
import copyDir from "../../helpers/extras/fs/copy-dir.helper.js";

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

  exists: (
    type: "file" | "dir" | "link",
    path: string,
    rights?: "r" | "w" | "rw",
  ) => Promise<
    [ExistsMethodResult, undefined] | [undefined, ExistsMethodError]
  > = async (type, path, rights) => {
    return await fsExtras.exists(type, path, rights);
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

        switch (this._crudMode) {
          case "copy": {
            const copyFileError = await copyFile(
              fileTypePayload.srcPath,
              fileTypePayload.dstPath,
              addFileOpts,
            );
            if (copyFileError) return copyFileError;
            break;
          }
          case "symlink": {
            const createSymlinkError = await createSymlink(
              "file",
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

        switch (this._crudMode) {
          case "copy": {
            const copyDirError = await copyDir(
              fileTypePayload.srcPath,
              fileTypePayload.dstPath,
              addDirOpts,
            );
            if (copyDirError) return copyDirError;
            break;
          }
          case "symlink": {
            const createSymlinkError = await createSymlink(
              "dir",
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
      case "file": {
        const deleteFileOpts: Required<DeleteFilePayloadOpts> = {
          mustExist: false,
        };

        if (fileTypePayload.opts)
          if (typeof fileTypePayload.opts.mustExist !== "undefined")
            deleteFileOpts.mustExist = fileTypePayload.opts.mustExist;

        switch (this._crudMode) {
          case "copy": {
            const deleteFileError = await fsExtras.deleteFile(
              fileTypePayload.path,
              deleteFileOpts,
            );
            if (deleteFileError) return deleteFileError;
            break;
          }
          case "symlink": {
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

        switch (this._crudMode) {
          case "copy": {
            const deleteDirError = await deleteDir(
              fileTypePayload.path,
              deleteDirOpts,
            );
            if (deleteDirError) return deleteDirError;
            break;
          }
          case "symlink": {
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
