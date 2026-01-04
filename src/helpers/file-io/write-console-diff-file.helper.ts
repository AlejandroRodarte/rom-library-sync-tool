import path from "path";
import type { Console } from "../../types.js";
import {
  LOCAL_ROM_DIFFS_DIR_PATH,
  LOCAL_ROM_LISTS_DIR_PATH,
  LOCAL_ROMS_DIR_PATH,
} from "../../constants/paths.constants.js";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import findAndDeleteFile from "./find-and-delete-file.helper.js";
import readUtf8FileLines from "./read-utf8-file-lines.helper.js";
import build from "../build/index.js";
import openNewWriteOnlyFile from "./open-new-write-only-file.helper.js";
import writeToFile from "./write-to-file.helper.js";

const writeConsoleDiffFile = async (
  name: string,
  konsole: Console,
): Promise<void> => {
  const romsDirPath = path.resolve(LOCAL_ROMS_DIR_PATH, name);
  const listFilePath = path.resolve(LOCAL_ROM_LISTS_DIR_PATH, `${name}.txt`);
  const diffFilePath = path.resolve(
    LOCAL_ROM_DIFFS_DIR_PATH,
    `${name}.diff.txt`,
  );

  const listFileAccessError = await fileExistsAndIsReadable(listFilePath);
  if (listFileAccessError) {
    console.log(listFileAccessError.message);
    console.log("Skipping this console.");
    return;
  }

  const diffFileDeleteError = await findAndDeleteFile(diffFilePath, false);
  if (diffFileDeleteError) {
    console.log(diffFileDeleteError.message);
    console.log("Skipping this console.");
    return;
  }

  const [currentFilenames, listFileReadError] =
    await readUtf8FileLines(listFilePath);
  if (listFileReadError) {
    console.log(listFileReadError.message);
    console.log("Skipping this console.");
    return;
  }
  if (!currentFilenames) {
    console.log(
      "Did not get list of current filenames from readUtf8FileLines().",
    );
    console.log("Skipping this console.");
    return;
  }

  const newFilenames = build.selectedRomFilenamesFromConsole(konsole);
  const [diffFileHandle, diffFileOpenError] =
    await openNewWriteOnlyFile(diffFilePath);
  if (diffFileOpenError) {
    console.log(diffFileOpenError.message);
    console.log("Skipping this console.");
    return;
  }
  if (!diffFileHandle) {
    console.log(
      "Did not get FileHandle for diff file from openNewWriteOnlyFile().",
    );
    console.log("Skipping this console.");
    return;
  }

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

    const writeError = await writeToFile(
      diffFileHandle,
      `add-file|"${romsDirPath}/${newFilename}"\n`,
      "utf8",
    );
    if (writeError) {
      console.log(writeError.message);
      console.log("Deleting diff file and skipping this console.");
      await diffFileHandle.close();
      const deleteError = await findAndDeleteFile(diffFilePath);
      if (deleteError) {
        console.log(deleteError.message);
        console.log("Was not able to delete diff file.");
      }
      return;
    }
  }

  for (const currentFilename of currentFilenames) {
    const writeError = await writeToFile(
      diffFileHandle,
      `remove-file|"${currentFilename}"\n`,
      "utf8",
    );
    if (writeError) {
      console.log(writeError.message);
      console.log("Deleting diff file and skipping this console.");
      await diffFileHandle.close();
      const deleteError = await findAndDeleteFile(diffFilePath);
      if (deleteError) {
        console.log(deleteError.message);
        console.log("Was not able to delete diff file.");
      }
      return;
    }
  }
  await diffFileHandle.close();
};

export default writeConsoleDiffFile;
