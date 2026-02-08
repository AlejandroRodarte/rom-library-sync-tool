import os from "node:os";

import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";
import readFile, {
  type ReadFileError,
} from "../../wrappers/modules/fs/read-file.helper.js";
import { READ } from "../../../constants/rights/rights.constants.js";

export type ReadUTF8LinesError =
  | FileExistsError
  | ExistsFalseErrors
  | ReadFileError;

const readUTF8Lines = async (
  filePath: string,
): Promise<[string[], undefined] | [undefined, ReadUTF8LinesError]> => {
  const [fileExistsResult, existsError] = await fileExists(filePath, READ);

  if (existsError) return [undefined, existsError];
  if (!fileExistsResult.exists) return [undefined, fileExistsResult.error];

  const [content, readFileError] = await readFile(filePath, {
    encoding: "utf8",
  });
  if (readFileError) return [undefined, readFileError];

  const lines = content.toString().trim().split(os.EOL);
  if (lines.length === 1 && lines[0] === "") return [[], undefined];
  return [lines, undefined];
};

export default readUTF8Lines;
