import path from "node:path";
import type { Console } from "../../types.js";
import { LOCAL_ROM_LISTS_DIR_PATH } from "../../constants/paths.constants.js";
import build from "../build/index.js";
import findAndDeleteFile from "./find-and-delete-file.helper.js";
import openNewWriteOnlyFile from "./open-new-write-only-file.helper.js";
import writeToFileOrDelete from "./write-to-file-or-delete.helper.js";

const writeConsoleListFile = async (name: string, konsole: Console) => {
  const listFilePath = path.resolve(LOCAL_ROM_LISTS_DIR_PATH, `${name}.txt`);

  const listFileDeleteError = await findAndDeleteFile(listFilePath, false);
  if (listFileDeleteError) {
    console.log(listFileDeleteError.message);
    console.log("Skipping this console.");
    return;
  }

  const [listFileHandle, listFileOpenError] =
    await openNewWriteOnlyFile(listFilePath);
  if (listFileOpenError) {
    console.log(listFileOpenError.message);
    console.log("Skipping this console.");
    return;
  }
  if (!listFileHandle) {
    console.log(
      "writeConsoleListFile(): FileHandle was not provided by openNewWriteOnlyFile().",
    );
    console.log("Skipping this console.");
    return;
  }

  const newFilenames = build
    .selectedRomFilenamesFromConsole(konsole)
    .join("\n");

  const listFileWriteOrDeleteError = await writeToFileOrDelete(
    listFilePath,
    listFileHandle,
    newFilenames + "\n",
    "utf8",
  );

  if (listFileWriteOrDeleteError) {
    console.log(listFileWriteOrDeleteError.message);
    console.log("Skipping this console.");
    return;
  }

  await listFileHandle.close();
};

export default writeConsoleListFile;
