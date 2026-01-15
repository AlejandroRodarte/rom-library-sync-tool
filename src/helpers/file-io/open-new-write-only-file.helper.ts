import type { PathLike } from "node:fs";
import open, { type OpenFileError } from "./open.helper.js";
import type { FileHandle } from "node:fs/promises";

export type OpenNewWriteOnlyFileError = OpenFileError;

const openNewWriteOnlyFile = async (
  filePath: PathLike,
): Promise<
  [FileHandle, undefined] | [undefined, OpenNewWriteOnlyFileError]
> => {
  const [handle, openError] = await open(filePath, "wx");
  if (openError) return [undefined, openError];
  return [handle, undefined];
};

export default openNewWriteOnlyFile;
