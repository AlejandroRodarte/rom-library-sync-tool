import type {
  FileIO,
  LsMethodError,
} from "../../../../interfaces/file-io.interface.js";
import type { WriteConsoleRomsListOperation } from "../../../../interfaces/write-console-roms-list-operation.interface.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../extras/fs/write-lines.helper.js";

export type WriteConsoleRomsListError =
  | LsMethodError
  | OpenFileForWritingError
  | WriteLinesError;

const writeConsoleRomsList = async (
  op: WriteConsoleRomsListOperation,
  ls: FileIO["ls"],
): Promise<WriteConsoleRomsListError | undefined> => {
  const [lsEntries, lsError] = await ls(op.paths.device.dir);
  if (lsError) return lsError;

  const filenames = lsEntries
    .map((e) => e.name)
    .filter((n) => n !== "systeminfo.txt" && n !== "metadata.txt");

  const [listFileHandle, openListFileError] = await openFileForWriting(
    op.paths.project.file,
    { overwrite: true },
  );
  if (openListFileError) return openListFileError;

  const writeLinesError = await writeLines(listFileHandle, filenames);

  if (writeLinesError) {
    await listFileHandle.close();
    return writeLinesError;
  }

  await listFileHandle.close();
};

export default writeConsoleRomsList;
