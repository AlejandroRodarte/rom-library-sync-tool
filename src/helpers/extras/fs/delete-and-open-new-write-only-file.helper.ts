import type { PathLike } from "node:fs";
import type { FileHandle } from "node:fs/promises";
import openNewWriteOnlyFile, {
  type OpenNewWriteOnlyFileError,
} from "./open-new-write-only-file.helper.js";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";

export type DeleteAndOpenWriteOnlyFileError =
  | DeleteFileError
  | OpenNewWriteOnlyFileError;

const deleteAndOpenWriteOnlyFile = async (
  filePath: PathLike,
): Promise<
  [FileHandle, undefined] | [undefined, DeleteAndOpenWriteOnlyFileError]
> => {
  const deleteError = await deleteFile(filePath, false);
  if (deleteError) return [undefined, deleteError];

  const [fileHandle, openError] = await openNewWriteOnlyFile(filePath);
  if (openError) return [undefined, openError];

  return [fileHandle, undefined];
};

export default deleteAndOpenWriteOnlyFile;
