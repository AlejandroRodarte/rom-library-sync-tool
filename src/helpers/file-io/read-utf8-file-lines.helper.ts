import os from "os";
import type { PathLike } from "node:fs";
import readUtf8FileIntoString from "./read-utf8-file.helper.js";

const readUtf8FileLines = async (filePath: PathLike): Promise<[string[], undefined] | [undefined, Error]> => {
  const [buffer, readError] = await readUtf8FileIntoString(filePath);
  if (readError) return [undefined, readError];
  if (!buffer) return [undefined, new Error("readUtf8FileLines(): did not get a buffer back from readUtf8FileIntoString().")];
  return [buffer.split(os.EOL), undefined];
};

export default readUtf8FileLines;
