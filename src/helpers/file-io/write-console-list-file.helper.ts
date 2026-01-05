import path from "node:path";
import type { Console } from "../../types.js";
import { LOCAL_ROM_LISTS_DIR_PATH } from "../../constants/paths.constants.js";
import fileIO from "./index.js";
import build from "../build/index.js";

const writeConsoleListFile = async (name: string, konsole: Console) => {
  const listFilePath = path.resolve(LOCAL_ROM_LISTS_DIR_PATH, `${name}.txt`);

  const listFileFindAndDeleteError = await fileIO.findAndDeleteFile(
    listFilePath,
    true,
  );
  if (listFileFindAndDeleteError) {
    console.log(listFileFindAndDeleteError.message);
    console.log("Skipping this console.");
    return;
  }

  const [listFileHandle, listFileOpenError] =
    await fileIO.openNewWriteOnlyFile(listFilePath);
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

  const listFileWriteOrDeleteError = await fileIO.writeToFileOrDelete(
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
