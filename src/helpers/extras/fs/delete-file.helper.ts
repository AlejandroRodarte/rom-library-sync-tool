import type { PathLike } from "node:fs";
import UnknownError from "../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../classes/errors/file-io-not-found-error.class.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import unlink, { type UnlinkError } from "../../wrappers/modules/fs/unlink.helper.js";

export type DeleteFileError = UnknownError | FileExistsError | UnlinkError;

const deleteFile = async (
  filePath: PathLike,
  fileMustExist: boolean = false,
): Promise<DeleteFileError | undefined> => {
  const fileExistsError = await fileExists(filePath);

  if (
    !fileMustExist &&
    fileExistsError &&
    fileExistsError instanceof FileIONotFoundError
  )
    return undefined;

  if (fileExistsError) return fileExistsError;

  const unlinkError = await unlink(filePath);
  if (unlinkError) return unlinkError;
};

export default deleteFile;
