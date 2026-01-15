import type { FileHandle } from "node:fs/promises";
import type { PathLike } from "node:fs";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";
import logger from "../../objects/logger.object.js";
import writeFile, { type WriteFileError } from "../wrappers/modules/fs/write-file.helper.js";

export type WriteToFileOrDeleteError = WriteFileError | DeleteFileError;

const writeToFileOrDelete = async (
  filePath: PathLike,
  fileHandle: FileHandle,
  content: string,
  encoding: BufferEncoding,
): Promise<undefined | WriteToFileOrDeleteError> => {
  const writeError = await writeFile(fileHandle, content, encoding);

  if (writeError) {
    logger.error(writeError.toString());
    logger.error("Closing file handle and deleting file.");

    await fileHandle.close();
    const deleteError = await deleteFile(filePath, true);
    if (deleteError) return deleteError;
    return writeError;
  }
};

export default writeToFileOrDelete;
