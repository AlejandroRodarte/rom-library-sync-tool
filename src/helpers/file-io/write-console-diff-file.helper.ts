import path from "path";

import type { DeviceDirPaths } from "../../types.js";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import filenameIndexesToAddAndDelete from "../build/filename-indexes-to-add-and-delete.helper.js";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";
import readUtf8FileLines, {
  type ReadUtf8FileLinesError,
} from "./read-utf8-file-lines.helper.js";
import openNewWriteOnlyFile, {
  type OpenNewWriteOnlyFileError,
} from "./open-new-write-only-file.helper.js";
import writeAddFileLineToDiffFile, {
  type WriteAddFileLineToDiffFileError,
} from "./write-add-file-line-to-diff-file.helper.js";
import writeDeleteFileLineToDiffFile, {
  type WriteDeleteFileLineToDiffFileError,
} from "./write-delete-file-line-to-diff-file.helper.js";
import type Console from "../../classes/console.class.js";

const build = {
  filenameIndexesToAddAndDelete,
};

export type WriteConsoleDiffFileError =
  | DeleteFileError
  | ReadUtf8FileLinesError
  | OpenNewWriteOnlyFileError
  | WriteAddFileLineToDiffFileError
  | WriteDeleteFileLineToDiffFileError;

const writeConsoleDiffFile = async (
  konsole: Console,
  devicePaths: DeviceDirPaths,
): Promise<WriteConsoleDiffFileError | undefined> => {
  const listFilePath = path.join(devicePaths.lists, `${konsole.name}.txt`);
  const diffFilePath = path.join(devicePaths.diffs, `${konsole.name}.diff.txt`);

  let listFileExists = true;
  const listFileAccessError = await fileExistsAndIsReadable(listFilePath);
  if (listFileAccessError) listFileExists = false;

  const diffFileDeleteError = await deleteFile(diffFilePath, false);
  if (diffFileDeleteError) return diffFileDeleteError;

  const [currentFilenames, listFileReadError] = listFileExists
    ? await readUtf8FileLines(listFilePath)
    : [[], undefined];
  if (listFileReadError) return listFileReadError;

  const newFilenames = konsole.selectedRoms
    .values()
    .map((rom) => rom.filename)
    .toArray();

  const [diffFileHandle, diffFileOpenError] =
    await openNewWriteOnlyFile(diffFilePath);
  if (diffFileOpenError) return diffFileOpenError;

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

    if (diffFileWriteError) return diffFileWriteError;
  }

  for (const index of indexes.currentFilenames.toDelete) {
    const filenameToDelete = currentFilenames[index];
    if (!filenameToDelete) continue;

    const diffFileWriteError = await writeDeleteFileLineToDiffFile(
      filenameToDelete,
      diffFilePath,
      diffFileHandle,
    );

    if (diffFileWriteError) return diffFileWriteError;
  }
  await diffFileHandle.close();
};

export default writeConsoleDiffFile;
