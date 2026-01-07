import fs, { type FileHandle } from "node:fs/promises";
import type { PathLike } from "node:fs";
import typeGuards from "../typescript/guards/index.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";
import FsWrongTypeError from "../../classes/errors/fs-wrong-type-error.class.js";
import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";

export type OpenFileError =
  | UnknownError
  | FsNotFoundError
  | FsUnauthorizedError
  | FsWrongTypeError
  | FsFileExistsError;

const openFile = async (
  filePath: PathLike,
  flags: string,
): Promise<[FileHandle, undefined] | [undefined, OpenFileError]> => {
  try {
    const handle = await fs.open(filePath, flags);
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
          new FsNotFoundError(
            `File to open was not found at file path ${filePath}.`,
          ),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FsUnauthorizedError(
            `Was able to find file at ${filePath}, but this process lacks the permissions to open it.`,
          ),
        ];
      case "EISDIR":
        return [
          undefined,
          new FsWrongTypeError(
            `Path ${filePath} points to a directory, NOT to a file.`,
          ),
        ];
      case "EEXIST":
        return [
          undefined,
          new FsFileExistsError(
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

export default openFile;
