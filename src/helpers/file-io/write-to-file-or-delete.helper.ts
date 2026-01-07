import type { FileHandle } from "node:fs/promises";
import writeToFile, { type WriteToFileError } from "./write-to-file.helper.js";
import findAndDeleteFile, {
  type FindAndDeleteFileError,
} from "./find-and-delete-file.helper.js";
import type { PathLike } from "node:fs";

export type WriteToFileOrDeleteError =
  | WriteToFileError
  | FindAndDeleteFileError;

const writeToFileOrDelete = async (
  filePath: PathLike,
  fileHandle: FileHandle,
  content: string,
  encoding: BufferEncoding,
): Promise<undefined | WriteToFileOrDeleteError> => {
  const writeError = await writeToFile(fileHandle, content, encoding);

  if (writeError) {
    console.log(writeError.message);
    console.log("Closing file handle and deleting file.");

    await fileHandle.close();
    const deleteError = await findAndDeleteFile(filePath);
    if (deleteError) return deleteError;
    return writeError;
  }
};

export default writeToFileOrDelete;
