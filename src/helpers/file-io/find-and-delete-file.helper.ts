import type { PathLike } from "node:fs";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";

export type FindAndDeleteFileError = FileExistsError | DeleteFileError;

const findAndDeleteFile = async (
  filePath: PathLike,
  fileMustExist = false,
): Promise<undefined | FindAndDeleteFileError> => {
  const existsError = await fileExists(filePath);

  if (existsError) {
    if (fileMustExist) return existsError;
    else return undefined;
  }

  const deleteError = await deleteFile(filePath);
  if (deleteError) return deleteError;
};

export default findAndDeleteFile;
