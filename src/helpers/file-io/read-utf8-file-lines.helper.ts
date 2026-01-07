import os from "os";
import type { PathLike } from "node:fs";
import readUtf8FileIntoString, {
  type ReadUtf8FileIntoStringError,
} from "./read-utf8-file-into-string.helper.js";

export type ReadUtf8FileLinesError = ReadUtf8FileIntoStringError;

const readUtf8FileLines = async (
  filePath: PathLike,
): Promise<[string[], undefined] | [undefined, ReadUtf8FileLinesError]> => {
  const [buffer, readError] = await readUtf8FileIntoString(filePath);
  if (readError) return [undefined, readError];
  return [buffer.split(os.EOL), undefined];
};

export default readUtf8FileLines;
