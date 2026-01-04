import type { PathLike } from "node:fs";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import deleteFile from "./delete-file.helper.js";

const findAndDeleteFile = async (
  filePath: PathLike,
  fileMustExist = false,
): Promise<undefined | Error> => {
  const accessError = await fileExistsAndIsReadable(filePath);

  if (accessError) {
    if (fileMustExist) return accessError;
    else return undefined;
  }

  const deleteError = await deleteFile(filePath);
  if (deleteError) return deleteError;

  return undefined;
};

export default findAndDeleteFile;
