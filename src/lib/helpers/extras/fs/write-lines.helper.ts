import type { FileHandle } from "node:fs/promises";
import os from "node:os";
import writeFile, {
  type WriteFileError,
} from "../../wrappers/modules/fs/write-file.helper.js";

export type WriteLinesError = WriteFileError;

const writeLines = async (
  file: string | FileHandle,
  lines: string[],
  encoding: BufferEncoding = "utf8",
): Promise<WriteLinesError | undefined> => {
  const content = `${lines.join(os.EOL)}${os.EOL}`;
  const writeFileError = await writeFile(file, content, { encoding });
  if (writeFileError) return writeFileError;
};

export default writeLines;
