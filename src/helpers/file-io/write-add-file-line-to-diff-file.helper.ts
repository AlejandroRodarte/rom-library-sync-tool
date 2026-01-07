import type { PathLike } from "node:fs";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import type { FileHandle } from "node:fs/promises";

export type WriteAddFileLineToDiffFileError = WriteToFileOrDeleteError;

const writeAddFileLineToDiffFile = async (
  filename: string,
  diffFilePath: PathLike,
  diffFileHandle: FileHandle,
): Promise<WriteAddFileLineToDiffFileError | undefined> => {
  const diffFileWriteError = await writeToFileOrDelete(
    diffFilePath,
    diffFileHandle,
    `add-file|${filename}\n`,
    "utf8",
  );
  if (diffFileWriteError) return diffFileWriteError;
};

export default writeAddFileLineToDiffFile;
