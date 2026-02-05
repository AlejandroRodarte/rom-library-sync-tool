import type { WriteRomsListOperation } from "../../../../../interfaces/classes/devices/generic-device/operations/write-roms-list-operation.interface.js";
import type {
  FileIO,
  LsMethodError,
} from "../../../../../interfaces/file-io.interface.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../../extras/fs/open-file-for-writing.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../../extras/fs/write-lines.helper.js";

export type WriteRomsListError =
  | LsMethodError
  | OpenFileForWritingError
  | WriteLinesError;

const writeRomsList = async (
  op: WriteRomsListOperation,
  ls: FileIO["ls"],
): Promise<WriteRomsListError | undefined> => {
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

export default writeRomsList;
