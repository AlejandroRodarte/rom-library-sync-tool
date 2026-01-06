import type { PathLike } from "node:fs";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import readUtf8FileLines from "./read-utf8-file-lines.helper.js";

const fileExistsAndReadUtf8Lines = async (
  filePath: PathLike,
): Promise<[string[], undefined] | [undefined, Error]> => {
  const existsError = await fileExistsAndIsReadable(filePath);
  if (existsError) return [undefined, existsError];

  const [lines, readError] = await readUtf8FileLines(filePath);
  if (readError) return [undefined, readError];

  return [lines, undefined];
};

export default fileExistsAndReadUtf8Lines;
