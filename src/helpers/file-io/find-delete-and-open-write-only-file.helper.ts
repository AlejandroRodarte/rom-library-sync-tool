import type { PathLike } from "node:fs";
import type { FileHandle } from "node:fs/promises";
import findAndDeleteFile, {
  type FindAndDeleteFileError,
} from "./find-and-delete-file.helper.js";
import openNewWriteOnlyFile, {
  type OpenNewWriteOnlyFileError,
} from "./open-new-write-only-file.helper.js";

export type FindDeleteAndOpenWriteOnlyFileError =
  | FindAndDeleteFileError
  | OpenNewWriteOnlyFileError;

const findDeleteAndOpenWriteOnlyFile = async (
  filePath: PathLike,
): Promise<
  [FileHandle, undefined] | [undefined, FindDeleteAndOpenWriteOnlyFileError]
> => {
  const deleteError = await findAndDeleteFile(filePath, false);
  if (deleteError) return [undefined, deleteError];

  const [fileHandle, openError] = await openNewWriteOnlyFile(filePath);
  if (openError) return [undefined, openError];

  return [fileHandle, undefined];
};

export default findDeleteAndOpenWriteOnlyFile;
