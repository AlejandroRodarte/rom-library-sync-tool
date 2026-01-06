import type { PathLike } from "node:fs";
import type { FileHandle } from "node:fs/promises";
import findAndDeleteFile from "./find-and-delete-file.helper.js";
import openNewWriteOnlyFile from "./open-new-write-only-file.helper.js";

const findDeleteAndOpenWriteOnlyFile = async (
  filePath: PathLike,
): Promise<[FileHandle, undefined] | [undefined, Error]> => {
  const deleteError = await findAndDeleteFile(filePath, false);
  if (deleteError) return [undefined, deleteError];

  const [failedFileHandle, openError] = await openNewWriteOnlyFile(filePath);
  if (openError) return [undefined, openError];

  return [openError, undefined];
};

export default findDeleteAndOpenWriteOnlyFile;
