import type { PathLike } from "node:fs";
import type { FileHandle } from "node:fs/promises";
import open, { type OpenError } from "../wrappers/modules/fs/open.helper.js";

export type OpenNewWriteOnlyFileError = OpenError;

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
