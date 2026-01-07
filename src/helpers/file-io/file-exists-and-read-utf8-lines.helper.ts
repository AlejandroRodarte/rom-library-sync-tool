import type { PathLike } from "node:fs";
import fileExistsAndIsReadable, {
  type FileExistsAndIsReadableError,
} from "./file-exists-and-is-readable.helper.js";
import readUtf8FileLines, {
  type ReadUtf8FileLinesError,
} from "./read-utf8-file-lines.helper.js";

export type FileExistsAndReadUtf8Lines =
  | FileExistsAndIsReadableError
  | ReadUtf8FileLinesError;

const fileExistsAndReadUtf8Lines = async (
  filePath: PathLike,
): Promise<[string[], undefined] | [undefined, FileExistsAndReadUtf8Lines]> => {
  const existsError = await fileExistsAndIsReadable(filePath);
  if (existsError) return [undefined, existsError];

  const [lines, readError] = await readUtf8FileLines(filePath);
  if (readError) return [undefined, readError];

  return [lines, undefined];
};

export default fileExistsAndReadUtf8Lines;
