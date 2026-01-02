import { closeSync, openSync, writeSync, type PathLike } from "node:fs";
import path from "node:path";
import { LOCAL_ROMS_DIR_PATH } from "../../constants/paths.constants.js";

const writeConsoleDiffFile = (
  name: string,
  filepath: PathLike,
  currentFilenames: string[],
  newFilenames: string[],
): void => {
  const consoleRomsDirPath = path.resolve(LOCAL_ROMS_DIR_PATH, name);
  const diffConsoleFileDescriptor = openSync(filepath, "w");

  for (const newFilename of newFilenames) {
    const indexWhereNewFilenameIsOnCurrentList = currentFilenames.findIndex(
      (f) => f === newFilename,
    );
    const newFilenameIsOnCurrentList =
      indexWhereNewFilenameIsOnCurrentList !== -1;

    if (newFilenameIsOnCurrentList) {
      currentFilenames.splice(indexWhereNewFilenameIsOnCurrentList, 1);
      continue;
    }

    writeSync(
      diffConsoleFileDescriptor,
      `add-file|"${consoleRomsDirPath}/${newFilename}"\n`,
      null,
      "utf8",
    );
  }

  for (const currentConsoleFilename of currentFilenames) {
    writeSync(
      diffConsoleFileDescriptor,
      `remove-file|"${currentConsoleFilename}"\n`,
      null,
      "utf8",
    );
  }

  closeSync(diffConsoleFileDescriptor);
};

export default writeConsoleDiffFile;
