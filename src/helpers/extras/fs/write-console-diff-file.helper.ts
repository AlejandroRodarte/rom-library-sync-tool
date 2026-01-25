import filenameIndexesToAddAndDelete from "../../build/filename-indexes-to-add-and-delete.helper.js";
import deleteFile, { type DeleteFileError } from "./delete-file.helper.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "./open-file-for-writing.helper.js";
import writeAddFileLineToDiffFile, {
  type WriteAddFileLineToDiffFileError,
} from "./write-add-file-line-to-diff-file.helper.js";
import writeDeleteFileLineToDiffFile, {
  type WriteDeleteFileLineToDiffFileError,
} from "./write-delete-file-line-to-diff-file.helper.js";
import type Console from "../../../classes/console.class.js";
import fileExists, { type FileExistsError } from "./file-exists.helper.js";
import readUTF8Lines, {
  type ReadUTF8LinesError,
} from "./read-utf8-lines.helper.js";

const build = {
  filenameIndexesToAddAndDelete,
};

export type WriteConsoleDiffFileError =
  | FileExistsError
  | DeleteFileError
  | ReadUTF8LinesError
  | OpenFileForWritingError
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
  const listFileAccessError = await fileExists(filePaths.list, "r");
  if (listFileAccessError) listFileExists = false;

  const diffFileDeleteError = await deleteFile(filePaths.diff, {
    mustExist: false,
  });
  if (diffFileDeleteError) return diffFileDeleteError;

  const [currentFilenames, listFileReadError] = listFileExists
    ? await readUTF8Lines(filePaths.list)
    : [[], undefined];
  if (listFileReadError) return listFileReadError;

  const newFilenames = konsole.selectedRoms
    .values()
    .map((rom) => rom.file.name)
    .toArray();

  const [diffFileHandle, diffFileOpenError] = await openFileForWriting(
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
