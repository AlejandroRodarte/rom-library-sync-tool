import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import FileIOBadTypeError from "../../../../classes/errors/file-io-bad-type-error.class.js";

export type ReadFileError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOBadTypeError;

const readFile = async (
  ...args: Parameters<typeof fs.readFile>
): Promise<
  | [Awaited<ReturnType<typeof fs.readFile>>, undefined]
  | [undefined, ReadFileError]
> => {
  const [filePath] = args;

  try {
    const buffer = await fs.readFile(...args);
    return [buffer, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return [
        undefined,
        new UnknownError(
          `Something wrong happened while reading file at path ${filePath}.`,
        ),
      ];

    switch (e.code) {
      case "ENOENT":
        return [
          undefined,
          new FileIONotFoundError(`Was not able to find file at ${filePath}.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `This process lacks permissions to read file at ${filePath}.`,
          ),
        ];
      case "EISDIR":
        return [
          undefined,
          new FileIOBadTypeError(
            `Path ${filePath} is a directory, NOT a file.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something bad happened while trying to read file at ${filePath}. Error code: ${e.code}`,
          ),
        ];
    }
  }
};

export default readFile;
