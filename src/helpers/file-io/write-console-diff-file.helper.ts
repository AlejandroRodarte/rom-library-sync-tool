import path from "path";
import type { Console, DeviceDirPaths } from "../../types.js";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import findAndDeleteFile from "./find-and-delete-file.helper.js";
import readUtf8FileLines from "./read-utf8-file-lines.helper.js";
import build from "../build/index.js";
import openNewWriteOnlyFile from "./open-new-write-only-file.helper.js";
import writeAddFileLineToDiffFile from "./write-add-file-line-to-diff-file.helper.js";
import writeDeleteFileLineToDiffFile from "./write-delete-file-line-to-diff-file.helper.js";

const writeConsoleDiffFile = async (
  name: string,
  konsole: Console,
  devicePaths: DeviceDirPaths,
): Promise<void> => {
  const listFilePath = path.join(devicePaths.lists, `${name}.txt`);
  const diffFilePath = path.join(devicePaths.diffs, `${name}.diff.txt`);

  let listFileExists = true;
  const listFileAccessError = await fileExistsAndIsReadable(listFilePath);
  if (listFileAccessError) {
    console.log(listFileAccessError.message);
    console.log(
      "No list file exists for this console. Will generate diff anyways.",
    );
    listFileExists = false;
  }

  const diffFileDeleteError = await findAndDeleteFile(diffFilePath, false);
  if (diffFileDeleteError) {
    console.log(diffFileDeleteError.message);
    console.log("Skipping this console.");
    return;
  }

  const [currentFilenames, listFileReadError] = listFileExists
    ? await readUtf8FileLines(listFilePath)
    : [[], undefined];
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

  const indexes = build.filenameIndexesToAddAndDelete(
    currentFilenames,
    newFilenames,
  );

  for (const index of indexes.newFilenames.toAdd) {
    const filenameToAdd = newFilenames[index];
    if (!filenameToAdd) continue;

    const diffFileWriteError = await writeAddFileLineToDiffFile(
      filenameToAdd,
      diffFilePath,
      diffFileHandle,
    );

    if (diffFileWriteError) {
      console.log(diffFileWriteError.message);
      console.log("Skipping this console.");
      return;
    }
  }

  for (const index of indexes.currentFilenames.toDelete) {
    const filenameToDelete = currentFilenames[index];
    if (!filenameToDelete) continue;

    const diffFileWriteError = await writeDeleteFileLineToDiffFile(
      filenameToDelete,
      diffFilePath,
      diffFileHandle,
    );

    if (diffFileWriteError) {
      console.log(diffFileWriteError.message);
      console.log("Skipping this console.");
      return;
    }
  }
  await diffFileHandle.close();
};

export default writeConsoleDiffFile;
