import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";

export type ReaddirError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadTypeError;

const readdir = async (
  ...args: Parameters<typeof fs.readdir>
): Promise<
  | [Awaited<ReturnType<typeof fs.readdir>>, undefined]
  | [undefined, ReaddirError]
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
          new FileIONotFoundError(`Directory path ${path} was not found.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `This process is not authorized to read directory contents at ${path}.`,
          ),
        ];
      case "ENOTDIR":
        return [
          undefined,
          new FileIOBadTypeError(
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
