import fs from "node:fs/promises";
import typeGuards from "../typescript/guards/index.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";
import FsWrongTypeError from "../../classes/errors/fs-wrong-type-error.class.js";
import type { Dirent } from "node:fs";

export type ReaddirError =
  | UnknownError
  | FsNotFoundError
  | FsUnauthorizedError
  | FsWrongTypeError;

const readdir = async (
  args: Parameters<typeof fs.readdir>,
): Promise<
  [Dirent<NonSharedBuffer>[], undefined] | [undefined, ReaddirError]
> => {
  const [path] = args;

  try {
    const entries = await fs.readdir(...args);
    return [entries, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error happened while calling the readdir() function. Args: ${args}.`,
        ),
      ];

    switch (e.code) {
      case "ENOENT":
        return [
          undefined,
          new FsNotFoundError(
            `Directory path ${path} was not found. Original error message: ${e.message}.`,
          ),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FsUnauthorizedError(
            `This process is not authorized to read directory contents at ${path}. Original error message: ${e.message}.`,
          ),
        ];
      case "ENOTDIR":
        return [
          undefined,
          new FsWrongTypeError(
            `Path ${path} points to a file, NOT a directory.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something wrong happened while reading directory at ${path}. Error code: ${e.code}. Error message: ${e.message}.`,
          ),
        ];
    }
  }
};

export default readdir;
