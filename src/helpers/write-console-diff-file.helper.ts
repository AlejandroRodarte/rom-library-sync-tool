import { closeSync, openSync, writeSync, type PathLike } from "node:fs";
import { ROMS_DIR_PATH } from "../constants/paths.constants.js";

const writeConsoleDiffFile = (
  filepath: PathLike,
  currentFilenames: string[],
  newFilenames: string[],
): void => {
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
      `add-file "${ROMS_DIR_PATH}/${newFilename}"\n`,
      null,
      "utf8",
    );
  }

  for (const currentConsoleFilename of currentFilenames) {
    writeSync(
      diffConsoleFileDescriptor,
      `remove-file "${ROMS_DIR_PATH}/${currentConsoleFilename}"\n`,
      null,
      "utf8",
    );
  }

  closeSync(diffConsoleFileDescriptor);
};

export default writeConsoleDiffFile;
