import type {
  FileIO,
  LsMethodError,
} from "../../../../interfaces/file-io.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../extras/fs/write-lines.helper.js";

const fsExtras = {
  openFileForWriting,
  writeLines,
};

export type WriteConsoleMediaNameListError =
  | LsMethodError
  | OpenFileForWritingError
  | WriteLinesError;

const writeConsoleMediaNameList = async (
  op: WriteConsoleMediaNameListOperation,
  ls: FileIO["ls"],
): Promise<WriteConsoleMediaNameListError | undefined> => {
  const [lsEntries, lsError] = await ls(op.paths.device.dir);
  if (lsError) return lsError;

  const filenames = lsEntries.map((e) => e.name);

  const [listFileHandle, listFileError] = await fsExtras.openFileForWriting(
    op.paths.project.file,
    { overwrite: true },
  );
  if (listFileError) return listFileError;

  const writeLinesError = await fsExtras.writeLines(
    listFileHandle,
    filenames,
    "utf8",
  );

  if (writeLinesError) {
    await listFileHandle.close();
    return writeLinesError;
  }

  await listFileHandle.close();
};

export default writeConsoleMediaNameList;
