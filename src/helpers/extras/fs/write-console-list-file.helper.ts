import path from "node:path";
import openNewWriteOnlyFile, {
  type OpenNewWriteOnlyFileError,
} from "./open-new-write-only-file.helper.js";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";
import type Console from "../../../classes/console.class.js";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";

export type WriteConsoleListFileError =
  | DeleteFileError
  | OpenNewWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeConsoleListFile = async (
  name: string,
  konsole: Console,
  listsDirPath: string,
): Promise<WriteConsoleListFileError | undefined> => {
  const listFilePath = path.join(listsDirPath, `${name}.txt`);

  const listFileDeleteError = await deleteFile(listFilePath, false);
  if (listFileDeleteError) return listFileDeleteError;

  const [listFileHandle, listFileOpenError] =
    await openNewWriteOnlyFile(listFilePath);
  if (listFileOpenError) return listFileOpenError;

  const newFilenames = konsole.selectedRoms
    .values()
    .map((rom) => rom.filename)
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
