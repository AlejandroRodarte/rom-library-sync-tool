import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIOLockedError from "../../../../classes/errors/file-io-locked-error.class.js";

export type UnlinkError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadTypeError
  | FileIOLockedError;

const unlink = async (
  ...args: Parameters<typeof fs.unlink>
): Promise<UnlinkError | undefined> => {
  const [path] = args;

  try {
    await fs.unlink(...args);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        `An unknown error happened while deleting symlink at path ${path}.`,
      );

    switch (e.code) {
      case "ENOENT":
        return new FileIONotFoundError(`No symlink was found at path ${path}.`);
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is not authorized to delete symlink at ${path}.`,
        );
      case "EISDIR":
        return new FileIOBadTypeError(
          `fs.unlink() only works with files, NOT directories. ${path} is a directory.`,
        );
      case "EBUSY":
        return new FileIOLockedError(
          `Content at path ${path} may be locked by another process.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while deleting symlink at path ${path}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default unlink;
