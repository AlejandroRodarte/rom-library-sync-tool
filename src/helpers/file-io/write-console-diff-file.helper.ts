import path from "path";
import type { DeviceDirPaths } from "../../types.js";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import findAndDeleteFile, {
  type FindAndDeleteFileError,
} from "./find-and-delete-file.helper.js";
import readUtf8FileLines, {
  type ReadUtf8FileLinesError,
} from "./read-utf8-file-lines.helper.js";
import build from "../build/index.js";
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

export type WriteConsoleDiffFileError =
  | FindAndDeleteFileError
  | ReadUtf8FileLinesError
  | OpenNewWriteOnlyFileError
  | WriteAddFileLineToDiffFileError
  | WriteDeleteFileLineToDiffFileError;

const writeConsoleDiffFile = async (
  name: string,
  konsole: Console,
  devicePaths: DeviceDirPaths,
): Promise<WriteConsoleDiffFileError | undefined> => {
  const listFilePath = path.join(devicePaths.lists, `${name}.txt`);
  const diffFilePath = path.join(devicePaths.diffs, `${name}.diff.txt`);

  let listFileExists = true;
  const listFileAccessError = await fileExistsAndIsReadable(listFilePath);
  if (listFileAccessError) listFileExists = false;

  const diffFileDeleteError = await findAndDeleteFile(diffFilePath, false);
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
