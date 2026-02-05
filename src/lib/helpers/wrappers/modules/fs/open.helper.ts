import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";
import FileIOExistsError from "../../../../classes/errors/file-io-exists-error.class.js";

export type OpenError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadTypeError
  | FileIOExistsError;

const open = async (
  ...args: Parameters<typeof fs.open>
): Promise<
  [Awaited<ReturnType<typeof fs.open>>, undefined] | [undefined, OpenError]
> => {
  const [filePath, flags] = args;

  try {
    const handle = await fs.open(...args);
    return [handle, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error has happened while opening the file. File path: ${filePath}. Flags: ${flags}.`,
        ),
      ];

    switch (e.code) {
      case "ENOENT":
        return [
          undefined,
          new FileIONotFoundError(
            `File to open was not found at file path ${filePath}.`,
          ),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `Was able to find file at ${filePath}, but this process lacks the permissions to open it.`,
          ),
        ];
      case "EISDIR":
        return [
          undefined,
          new FileIOBadTypeError(
            `Path ${filePath} points to a directory, NOT to a file.`,
          ),
        ];
      case "EEXIST":
        return [
          undefined,
          new FileIOExistsError(
            `Path ${filePath} already exists in the filesystem.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something bad happened while opening file at ${filePath}. Error code: ${e.code}`,
          ),
        ];
    }
  }
};

export default open;
