import fs from "node:fs/promises";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import typeGuards from "../typescript/guards/index.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";
import FsWrongTypeError from "../../classes/errors/fs-wrong-type-error.class.js";

export type UnlinkError =
  | UnknownError
  | FsNotFoundError
  | FsUnauthorizedError
  | FsWrongTypeError;

const unlink = async (
  args: Parameters<typeof fs.unlink>,
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
        return new FsNotFoundError(`No symlink was found at path ${path}.`);
      case "EACCES":
      case "EPERM":
        return new FsUnauthorizedError(
          `This process is not authorized to delete symlink at ${path}.`,
        );
      case "EISDIR":
        return new FsWrongTypeError(
          `fs.unlink() only works with files, NOT directories. ${path} is a directory.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while deleting symlink at path ${path}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default unlink;
