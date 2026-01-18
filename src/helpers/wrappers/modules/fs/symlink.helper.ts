import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOCircularReferenceError from "../../../../classes/errors/file-io-circular-reference-error.class.js";
import FileIOExistsError from "../../../../classes/errors/file-io-exists-error.class.js";

export type SymlinkError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOCircularReferenceError
  | FileIOExistsError;

const symlink = async (
  ...args: Parameters<typeof fs.symlink>
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
        return new FileIONotFoundError(`Symlink path ${dst} does not exist.`);
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `This process lacks privileges to create a symlink on ${dst}.`,
        );
      case "ELOOP":
        return new FileIOCircularReferenceError(
          `Can't create symlink at ${dst}, as it would create a circular reference, resulting in an infinite loop of symlinks.`,
        );
      case "EEXIST":
        return new FileIOExistsError(
          `There is already an item on path ${dst}. Can not create symlink.`,
        );
      default:
        return new UnknownError(
          `There was an error trying to create symlink on ${dst} that links to pat ${src}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default symlink;
