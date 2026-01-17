import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import filenameIndexesToAddAndDelete from "../../build/filename-indexes-to-add-and-delete.helper.js";
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
import type Console from "../../../classes/console.class.js";

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
  filePaths: {
    list: string;
    diff: string;
  },
): Promise<WriteConsoleDiffFileError | undefined> => {
  let listFileExists = true;
  const listFileAccessError = await fileExistsAndIsReadable(filePaths.list);
  if (listFileAccessError) listFileExists = false;

  const diffFileDeleteError = await deleteFile(filePaths.diff, false);
  if (diffFileDeleteError) return diffFileDeleteError;

  const [currentFilenames, listFileReadError] = listFileExists
    ? await readUtf8FileLines(filePaths.list)
    : [[], undefined];
  if (listFileReadError) return listFileReadError;

  const newFilenames = konsole.selectedRoms
    .values()
    .map((rom) => rom.filename)
    .toArray();

  const [diffFileHandle, diffFileOpenError] = await openNewWriteOnlyFile(
    filePaths.diff,
  );
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
      filePaths.diff,
      diffFileHandle,
    );

    if (diffFileWriteError) return diffFileWriteError;
  }

  for (const index of indexes.currentFilenames.toDelete) {
    const filenameToDelete = currentFilenames[index];
    if (!filenameToDelete) continue;

    const diffFileWriteError = await writeDeleteFileLineToDiffFile(
      filenameToDelete,
      filePaths.diff,
      diffFileHandle,
    );

    if (diffFileWriteError) return diffFileWriteError;
  }
  await diffFileHandle.close();
};

export default writeConsoleDiffFile;
