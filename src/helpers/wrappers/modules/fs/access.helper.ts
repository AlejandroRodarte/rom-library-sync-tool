import fs from "node:fs/promises";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";
import typeGuards from "../../../typescript/guards/index.js";

export type AccessError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError;

const access = async (
  ...args: Parameters<typeof fs.access>
): Promise<AccessError | undefined> => {
  const [path, mode] = args;
  try {
    await fs.access(...args);
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return new UnknownError(
        `An unknown error has happened while calling the access() function. Path: ${path}. Mode: ${mode}.`,
      );

    switch (e.code) {
      case "ENOENT":
        return new FileIONotFoundError(`Path ${path} does not exist.`);
      case "EACCES":
      case "EPERM":
        return new FileIOUnauthorizedError(
          `Can not access path ${path} because this process in unauthorized to do so. Mode: ${mode}.`,
        );
      default:
        return new UnknownError(
          `Something bad happened while accessing path ${path}. Error code: ${e.code}. Error message: ${e.message}.`,
        );
    }
  }
};

export default access;
