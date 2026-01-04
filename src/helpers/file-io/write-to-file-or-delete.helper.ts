import type { FileHandle } from "node:fs/promises";
import writeToFile from "./write-to-file.helper.js";
import findAndDeleteFile from "./find-and-delete-file.helper.js";
import type { PathLike } from "node:fs";

const writeToFileOrDelete = async (
  filePath: PathLike,
  fileHandle: FileHandle,
  content: string,
  encoding: BufferEncoding,
): Promise<undefined | Error> => {
  const writeError = await writeToFile(fileHandle, content, encoding);

  if (writeError) {
    console.log(writeError.message);
    console.log("Closing FileHandle and deleting file.");

    await fileHandle.close();
    const deleteError = await findAndDeleteFile(filePath);
    if (deleteError) return deleteError;
    return writeError;
  }
};

export default writeToFileOrDelete;
