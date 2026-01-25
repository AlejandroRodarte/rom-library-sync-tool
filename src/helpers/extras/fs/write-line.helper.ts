import type { FileHandle } from "node:fs/promises";
import os from "node:os";
import writeFile, {
  type WriteFileError,
} from "../../wrappers/modules/fs/write-file.helper.js";

export type WriteLineError = WriteFileError;

const writeLine = async (
  file: string | FileHandle,
  line: string,
  encoding: BufferEncoding = "utf8",
): Promise<WriteLineError | undefined> => {
  const content = `${line}${os.EOL}`;
  const writeFileError = await writeFile(file, content, { encoding });
  if (writeFileError) return writeFileError;
};

export default writeLine;
