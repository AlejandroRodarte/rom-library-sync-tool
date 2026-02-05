import type { WriteMediaNameListOperation } from "../../../../../interfaces/classes/devices/generic-device/operations/write-media-name-list-operation.interface.js";
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

const fsExtras = {
  openFileForWriting,
  writeLines,
};

export type WriteMediaNameListError =
  | LsMethodError
  | OpenFileForWritingError
  | WriteLinesError;

const writeMediaNameList = async (
  op: WriteMediaNameListOperation,
  ls: FileIO["ls"],
): Promise<WriteMediaNameListError | undefined> => {
  const [lsEntries, lsError] = await ls(op.paths.device.dir);
  if (lsError) return lsError;

  const fsTypeandFilenameList = lsEntries
    .filter((e) => e.is.link)
    .map((e) => e.name);

  const [listFileHandle, listFileError] = await fsExtras.openFileForWriting(
    op.paths.project.file,
    { overwrite: true },
  );
  if (listFileError) return listFileError;

  const writeLinesError = await fsExtras.writeLines(
    listFileHandle,
    fsTypeandFilenameList,
    "utf8",
  );

  if (writeLinesError) {
    await listFileHandle.close();
    return writeLinesError;
  }

  await listFileHandle.close();
};

export default writeMediaNameList;
