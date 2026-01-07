import type { PathLike } from "node:fs";
import fs from "node:fs/promises";
import typeGuards from "../typescript/guards/index.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";
import FsWrongTypeError from "../../classes/errors/fs-wrong-type-error.class.js";

export type DeleteFileError =
  | UnknownError
  | FsNotFoundError
  | FsUnauthorizedError
  | FsWrongTypeError;

const deleteFile = async (
  filePath: PathLike,
): Promise<DeleteFileError | undefined> => {
  try {
    await fs.unlink(filePath);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        `Something wrong happened while deleting a file. File path: ${filePath}.`,
      );

    switch (e.code) {
      case "ENOENT":
        return new FsNotFoundError(`File in path ${filePath} does not exist.`);
      case "EACCES":
      case "EPERM":
        return new FsUnauthorizedError(
          `File in path ${filePath} exists, but this process lacks privileges to delete it.`,
        );
      case "EISDIR":
        return new FsWrongTypeError(
          `Path ${filePath} points to a directory, NOT to a file.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while deleting file at path ${filePath}. Error code: ${e.code}.`,
        );
    }
  }
};

export default deleteFile;
