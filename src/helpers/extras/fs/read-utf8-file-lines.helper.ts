import os from "os";
import type { PathLike } from "node:fs";
import readFile, { type ReadFileError } from "../../wrappers/modules/fs/read-file.helper.js";

export type ReadUtf8FileLinesError = ReadFileError;

const readUtf8FileLines = async (
  filePath: PathLike,
): Promise<[string[], undefined] | [undefined, ReadUtf8FileLinesError]> => {
  const [buffer, readError] = await readFile(filePath, { encoding: "utf8" });
  if (readError) return [undefined, readError];  
  return [buffer.toString().split(os.EOL), undefined];
};

export default readUtf8FileLines;
