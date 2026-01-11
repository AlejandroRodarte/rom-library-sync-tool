import type { FileHandle } from "node:fs/promises";
import writeToFile, { type WriteToFileError } from "./write-to-file.helper.js";
import type { PathLike } from "node:fs";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";

export type WriteToFileOrDeleteError = WriteToFileError | DeleteFileError;

const writeToFileOrDelete = async (
  filePath: PathLike,
  fileHandle: FileHandle,
  content: string,
  encoding: BufferEncoding,
): Promise<undefined | WriteToFileOrDeleteError> => {
  const writeError = await writeToFile(fileHandle, content, encoding);

  if (writeError) {
    console.log(writeError.reasons);
    console.log("Closing file handle and deleting file.");

    await fileHandle.close();
    const deleteError = await deleteFile(filePath, true);
    if (deleteError) return deleteError;
    return writeError;
  }
};

export default writeToFileOrDelete;
