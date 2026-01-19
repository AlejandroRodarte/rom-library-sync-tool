import os from "node:os";

import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";
import readFile, { type ReadFileError } from "../../wrappers/modules/fs/read-file.helper.js";

export type ReadUTF8LinesError = FileExistsError | ExistsFalseErrors | ReadFileError;

const readUTF8Lines = async (
  filePath: string,
): Promise<[string[], undefined] | [undefined, ReadUTF8LinesError]> => {
  const [fileExistsResult, existsError] = await fileExists(filePath, "r");

  if (existsError) return [undefined, existsError];
  if (!fileExistsResult.exists) return [undefined, fileExistsResult.error];

  const [lines, readFileError] = await readFile(filePath, { encoding: "utf8" });
  if (readFileError) return [undefined, readFileError];

  return [lines.toString().split(os.EOL), undefined];
};

export default readUTF8Lines;
