import fs from "node:fs/promises";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import typeGuards from "../../../typescript/guards/index.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIOExistsError from "../../../../classes/errors/file-io-exists-error.class.js";
import FileIOStorageFullError from "../../../../classes/errors/file-io-storage-full-error.class.js";
import FileIOLockedError from "../../../../classes/errors/file-io-locked-error.class.js";

export type CopyFileError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadTypeError
  | FileIOExistsError
  | FileIOStorageFullError
  | FileIOLockedError;

const copyFile = async (
  ...args: Parameters<typeof fs.copyFile>
): Promise<CopyFileError | undefined> => {
  const [srcPath, dstPath] = args;

  try {
    await fs.copyFile(...args);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        `An unknown error occurred while copying file from ${srcPath} to ${dstPath}.`,
      );

    switch (e.code) {
      case "ENOENT":
        return new FileIONotFoundError(`Source file ${srcPath} was not found.`);
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is not authorized to read source file at ${srcPath}.`,
        );
      case "EISDIR":
        return new FileIOBadTypeError(
          `Source path ${srcPath} is a file, NOT a directory.`,
        );
      case "EEXIST":
        return new FileIOExistsError(
          `There is already a file in destination path ${dstPath}.`,
        );
      case "ENOSPC":
        return new FileIOStorageFullError(
          `Destination disk is full. Can not copy over to ${dstPath}.`,
        );
      case "EBUSY":
        return new FileIOLockedError(
          `Source file ${srcPath} may be locked by another process. Can not copy to ${dstPath}.`,
        );
      default:
        return new UnknownError(
          `Something went wrong while copying file from ${srcPath} to ${dstPath}. Error code: ${e.code}. Original error message: ${e.message}.`,
        );
    }
  }
};

export default copyFile;
