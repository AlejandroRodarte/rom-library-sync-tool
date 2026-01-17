import type { PathLike } from "node:fs";
import type { FileHandle } from "node:fs/promises";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";

export type WriteDeleteFileLineToDiffFileError = WriteToFileOrDeleteError;

const writeDeleteFileLineToDiffFile = async (
  filename: string,
  diffFilePath: PathLike,
  diffFileHandle: FileHandle,
): Promise<WriteDeleteFileLineToDiffFileError | undefined> => {
  const diffFileWriteError = await writeToFileOrDelete(
    diffFilePath,
    diffFileHandle,
    `remove-file|${filename}\n`,
    "utf8",
  );
  if (diffFileWriteError) return diffFileWriteError;
};

export default writeDeleteFileLineToDiffFile;
