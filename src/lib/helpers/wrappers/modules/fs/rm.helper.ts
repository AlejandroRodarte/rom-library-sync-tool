import fs from "node:fs/promises";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import typeGuards from "../../../typescript/guards/index.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOLockedError from "../../../../classes/errors/file-io-locked-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIONotEmptyError from "../../../../classes/errors/file-io-not-empty-error.class.js";

export type RmError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOLockedError
  | FileIONotEmptyError
  | FileIOBadTypeError;

const rm = async (
  ...args: Parameters<typeof fs.rm>
): Promise<RmError | undefined> => {
  const [path] = args;

  try {
    await fs.rm(...args);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e)) return new UnknownError(`An unknown`);

    switch (e.code) {
      case "ENOENT":
        return new FileIONotFoundError(`Directory path ${path} was not found.`);
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process is not allowed to delete directory path at ${path}.`,
        );
      case "EBUSY":
        return new FileIOLockedError(
          `Directory path at ${path} is currently locked by another process.`,
        );
      case "ENOTDIR":
        return new FileIOBadTypeError(`Path ${path} is NOT a directory.`);
      case "ENOTEMPTY":
        return new FileIONotEmptyError(
          `Attempted to delete directory path ${path} non-recursively, but there is content inside it.`,
        );
      default:
        return new UnknownError(
          `Something went wrong while deleting directory path at ${path}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default rm;
