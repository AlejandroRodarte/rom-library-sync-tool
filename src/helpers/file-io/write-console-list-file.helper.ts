import path from "node:path";
import type { Console } from "../../types.js";
import build from "../build/index.js";
import findAndDeleteFile, {
  type FindAndDeleteFileError,
} from "./find-and-delete-file.helper.js";
import openNewWriteOnlyFile, {
  type OpenNewWriteOnlyFileError,
} from "./open-new-write-only-file.helper.js";
import writeToFileOrDelete, {
  type WriteToFileOrDeleteError,
} from "./write-to-file-or-delete.helper.js";

export type WriteConsoleListFileError =
  | FindAndDeleteFileError
  | OpenNewWriteOnlyFileError
  | WriteToFileOrDeleteError;

const writeConsoleListFile = async (
  name: string,
  konsole: Console,
  listsDirPath: string,
): Promise<WriteConsoleListFileError | undefined> => {
  const listFilePath = path.join(listsDirPath, `${name}.txt`);

  const listFileDeleteError = await findAndDeleteFile(listFilePath, false);
  if (listFileDeleteError) return listFileDeleteError;

  const [listFileHandle, listFileOpenError] =
    await openNewWriteOnlyFile(listFilePath);
  if (listFileOpenError) return listFileOpenError;

  const newFilenames = build
    .selectedRomFilenamesFromConsole(konsole)
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
