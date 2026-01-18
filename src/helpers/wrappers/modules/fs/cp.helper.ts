import fs from "node:fs/promises";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import typeGuards from "../../../typescript/guards/index.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOExistsError from "../../../../classes/errors/file-io-exists-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIOBadPathError from "../../../../classes/errors/file-io-bad-path-error.class.js";

export type CpError =
  | UnknownError
  | FileIONotFoundError
  | FileIOExistsError
  | FileIOUnauthorizedError
  | FileIOBadPathError
  | FileIOBadTypeError;

const cp = async (
  ...args: Parameters<typeof fs.cp>
): Promise<CpError | undefined> => {
  const [srcDir, dstDir] = args;

  try {
    await fs.cp(...args);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        `An unknown error happened while copying contents from source directory at ${srcDir} to ${dstDir}.`,
      );

    switch (e.code) {
      case "ENOENT":
        return new FileIONotFoundError(
          `Source directory ${srcDir} does not exist.`,
        );
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is not authorized to copy source directory at ${srcDir}.`,
        );
      case "EEXIST":
        return new FileIOExistsError(
          `Destination directory ${dstDir} already exists. Will not copy.`,
        );
      case "ENOTDIR":
      case "ERR_FS_CP_NON_DIR_TO_DIR":
        return new FileIOBadTypeError(
          `Source path ${srcDir} is a file, NOT a directory.`,
        );
      case "ERR_FS_CP_DIR_TO_NON_DIR":
        return new FileIOBadTypeError(
          `Destinarion path ${dstDir} is a file, NOT a directory.`,
        );
      case "ERR_FS_CP_EEXIST":
        return new FileIOExistsError(
          `Tried to copy over a file in source ${srcDir} that already existed in destination ${dstDir}. Error message: ${e.message}.`,
        );
      case "ERR_FS_CP_EINVAL":
        return new FileIOBadPathError(
          `Either the source directory ${srcDir} or the destinarion directory ${dstDir} point to an invalid path.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while copying from directory ${srcDir} over to ${dstDir}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default cp;
