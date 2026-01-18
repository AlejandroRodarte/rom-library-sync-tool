import type { PathLike } from "fs";
import type { FileExistsError } from "./file-exists.helper.js";
import fileExists from "./file-exists.helper.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";

export type AnyFileExistsError = FileExistsError;

const anyFileExists = async (
  filePaths: PathLike[],
): Promise<[boolean, undefined] | [undefined, AnyFileExistsError]> => {
  let fileFound = false;

  for (const filePath of filePaths) {
    const existsError = await fileExists(filePath);

    if (!existsError) {
      fileFound = true;
      break;
    }

    if (existsError instanceof FileIONotFoundError) continue;
    else return [undefined, existsError];
  }

  return [fileFound, undefined];
};

export default anyFileExists;
