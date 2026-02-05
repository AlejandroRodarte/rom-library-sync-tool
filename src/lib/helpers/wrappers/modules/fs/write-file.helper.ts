import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";

export type WriteFileError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadTypeError;

const writeFile = async (
  ...args: Parameters<typeof fs.writeFile>
): Promise<WriteFileError | undefined> => {
  try {
    await fs.writeFile(...args);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        "Something bad happened while writing to a file.",
      );

    switch (e.code) {
      case "ENOENT":
        return new FileIONotFoundError("File to write was not found.");
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          "This process lacks privileges to write to this file.",
        );
      case "EISDIR":
        return new FileIOBadTypeError(
          "The handle is associated to a directory, NOT a file.",
        );
      default:
        return new UnknownError(
          `Something bad happened while writing to a file. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default writeFile;
