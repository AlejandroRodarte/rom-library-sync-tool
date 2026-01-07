import type { PathLike } from "node:fs";
import openFile, { type OpenFileError } from "./open-file.helper.js";
import type { FileHandle } from "node:fs/promises";

export type OpenNewWriteOnlyFileError = OpenFileError;

const openNewWriteOnlyFile = async (
  filePath: PathLike,
): Promise<
  [FileHandle, undefined] | [undefined, OpenNewWriteOnlyFileError]
> => {
  const [handle, openError] = await openFile(filePath, "wx");
  if (openError) return [undefined, openError];
  return [handle, undefined];
};

export default openNewWriteOnlyFile;
