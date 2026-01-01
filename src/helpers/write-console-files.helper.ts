import path from "path";
import os from "node:os";
import selectedRomFilenamesFromConsole from "./build/selected-rom-filenames-from-console.helper.js";
import { DATA_DIR_PATH } from "../constants/paths.constants.js";
import { existsSync, readFileSync, unlinkSync } from "fs";
import writeRomFilenamesToConsoleFile from "./write-rom-filenames-to-console-file.helper.js";
import { truncateSync } from "node:fs";
import writeConsoleDiffFile from "./write-console-diff-file.helper.js";
import type { Console } from "../types.js";

const writeConsoleFiles = (name: string, konsole: Console): void => {
  const newConsoleFilenames = selectedRomFilenamesFromConsole(konsole);

  const consoleFilePath = path.resolve(DATA_DIR_PATH, `${name}.txt`);
  const diffConsoleFilePath = path.resolve(DATA_DIR_PATH, `${name}.diff.txt`);

  const consoleFileExists = existsSync(consoleFilePath);
  const diffConsoleFileExists = existsSync(diffConsoleFilePath);

  if (diffConsoleFileExists) unlinkSync(diffConsoleFilePath);

  if (!consoleFileExists) {
    writeRomFilenamesToConsoleFile(consoleFilePath, newConsoleFilenames);
    writeConsoleDiffFile(name, diffConsoleFilePath, [], newConsoleFilenames);
    return;
  }

  const currentConsoleFilenames = readFileSync(consoleFilePath)
    .toString()
    .split(os.EOL);
  truncateSync(consoleFilePath);

  writeRomFilenamesToConsoleFile(consoleFilePath, newConsoleFilenames);
  writeConsoleDiffFile(
    name,
    diffConsoleFilePath,
    currentConsoleFilenames,
    newConsoleFilenames,
  );
};

export default writeConsoleFiles;
