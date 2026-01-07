import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import typeGuards from "../typescript/guards/index.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";

export type AccessError = UnknownError | FsNotFoundError | FsUnauthorizedError;

const access = async (
  path: PathLike,
  mode?: number,
): Promise<AccessError | undefined> => {
  try {
    await fs.access(path, mode);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        `An unknown error has happened while calling the access() function. Path: ${path}. Mode: ${mode}.`,
      );

    switch (e.code) {
      case "ENOENT":
        return new FsNotFoundError(`Nothing found at path ${path}.`);
      case "EACCES":
      case "EPERM":
        return new FsUnauthorizedError(
          `Can not access path ${path} because this process in unauthorized to do so. Mode: ${mode}.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while accessing path ${path}. Error code: ${e.code}.`,
        );
    }
  }
};

export default access;
