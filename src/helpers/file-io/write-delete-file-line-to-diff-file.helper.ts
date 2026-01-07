import type { PathLike } from "node:fs";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import type { FileHandle } from "node:fs/promises";

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
