import type { PathLike } from "node:fs";
import openFile from "./open-file.helper.js";
import type { FileHandle } from "node:fs/promises";

const openNewWriteOnlyFile = async (
  filePath: PathLike,
): Promise<[FileHandle, undefined] | [undefined, Error]> => {
  const [handle, openError] = await openFile(filePath, "wx");
  if (openError) return [undefined, openError];
  return [handle, undefined];
};

export default openNewWriteOnlyFile;
