import type { PathLike } from "node:fs";
import writeToFileOrDelete from "./write-to-file-or-delete.helper.js";
import type { FileHandle } from "node:fs/promises";

const writeAddFileLineToDiffFile = async (
  filename: string,
  diffFilePath: PathLike,
  diffFileHandle: FileHandle,
  romsDirPath: PathLike,
): Promise<Error | undefined> => {
  const diffFileWriteError = await writeToFileOrDelete(
    diffFilePath,
    diffFileHandle,
    `add-file|"${romsDirPath}/${filename}"\n`,
    "utf8",
  );
  if (diffFileWriteError) return diffFileWriteError;
};

export default writeAddFileLineToDiffFile;
