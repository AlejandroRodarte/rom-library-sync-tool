import fs from "node:fs/promises";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import typeGuards from "../typescript/guards/index.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";
import FsCircularReferenceError from "../../classes/errors/fs-circular-reference-error.class.js";
import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";

export type SymlinkError =
  | UnknownError
  | FsNotFoundError
  | FsUnauthorizedError
  | FsCircularReferenceError
  | FsFileExistsError;

const symlink = async (
  args: Parameters<typeof fs.symlink>,
): Promise<SymlinkError | undefined> => {
  const [src, dst] = args;
  try {
    await fs.symlink(...args);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        `An unknown error happened while creating a new symlink at ${dst} that links to ${src}.`,
      );

    switch (e.code) {
      case "ENOENT":
        return new FsNotFoundError(
          `Symlink path ${dst} does not exist. Original error message: ${e.message}.`,
        );
      case "EACCES":
      case "EPERM":
        return new FsUnauthorizedError(
          `This process lacks privileges to create a symlink on ${dst}. Original error message: ${e.message}.`,
        );
      case "ELOOP":
        return new FsCircularReferenceError(
          `Can't create symlink at ${dst}, as it would create a circular reference, resulting in an infinite loop of symlinks. Original error message: ${e.message}.`,
        );
      case "EEXIST":
        return new FsFileExistsError(
          `There is already an item on path ${dst}. Can not create symlink. Original error message: ${e.message}.`,
        );
      default:
        return new UnknownError(
          `There was an error trying to create symlink on ${dst} that links to pat ${src}. Error code: ${e.code}. Original error message: ${e.message}.`,
        );
    }
  }
};

export default symlink;
