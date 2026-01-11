import fs, { type FileHandle } from "node:fs/promises";
import typeGuards from "../typescript/guards/index.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";
import FsWrongTypeError from "../../classes/errors/fs-wrong-type-error.class.js";

export type WriteToFileError =
  | UnknownError
  | FsNotFoundError
  | FsUnauthorizedError
  | FsWrongTypeError;

const writeToFile = async (
  fileHandle: FileHandle,
  content: string,
  encoding: BufferEncoding,
): Promise<WriteToFileError | undefined> => {
  try {
    await fs.writeFile(fileHandle, content, { encoding });
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        "Something bad happened while writing to a file.",
      );

    switch (e.code) {
      case "ENOENT":
        return new FsNotFoundError("File to write was not found.");
      case "EACCES":
      case "EPERM":
        return new FsUnauthorizedError(
          "This process lacks privileges to write to this file.",
        );
      case "EISDIR":
        return new FsWrongTypeError(
          "The handle is associated to a directory, NOT a file.",
        );
      default:
        return new UnknownError(
          `Something bad happened while writing to a file. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default writeToFile;
