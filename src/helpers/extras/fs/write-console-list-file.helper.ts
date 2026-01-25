import path from "node:path";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "./open-file-for-writing.helper.js";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import type Console from "../../../classes/console.class.js";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";

export type WriteConsoleListFileError =
  | DeleteFileError
  | OpenFileForWritingError
  | WriteToFileOrDeleteError;

const writeConsoleListFile = async (
  name: string,
  konsole: Console,
  listsDirPath: string,
): Promise<WriteConsoleListFileError | undefined> => {
  const listFilePath = path.join(listsDirPath, `${name}.txt`);

  const listFileDeleteError = await deleteFile(listFilePath, {
    mustExist: false,
  });
  if (listFileDeleteError) return listFileDeleteError;

  const [listFileHandle, listFileOpenError] =
    await openFileForWriting(listFilePath);
  if (listFileOpenError) return listFileOpenError;

  const newFilenames = konsole.selectedRoms
    .values()
    .map((rom) => rom.file.name)
    .toArray()
    .join("\n");

  const listFileWriteError = await writeToFileOrDelete(
    listFilePath,
    listFileHandle,
    newFilenames + "\n",
    "utf8",
  );
  if (listFileWriteError) return listFileWriteError;

  await listFileHandle.close();
};

export default writeConsoleListFile;
