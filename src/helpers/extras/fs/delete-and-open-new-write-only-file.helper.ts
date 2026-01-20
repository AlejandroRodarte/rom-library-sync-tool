import type { FileHandle } from "node:fs/promises";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "./open-file-for-writing.helper.js";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";

export type DeleteAndOpenWriteOnlyFileError =
  | DeleteFileError
  | OpenFileForWritingError;

const deleteAndOpenWriteOnlyFile = async (
  filePath: string,
): Promise<
  [FileHandle, undefined] | [undefined, DeleteAndOpenWriteOnlyFileError]
> => {
  const deleteError = await deleteFile(filePath, { mustExist: false });
  if (deleteError) return [undefined, deleteError];

  const [fileHandle, openError] = await openFileForWriting(filePath);
  if (openError) return [undefined, openError];

  return [fileHandle, undefined];
};

export default deleteAndOpenWriteOnlyFile;
