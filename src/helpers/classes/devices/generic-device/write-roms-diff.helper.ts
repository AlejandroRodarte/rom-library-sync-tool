import DIFF_LINE_SEPARATOR from "../../../../constants/diff-line-separator.constant.js";
import {
  ADD_ROM,
  DELETE_ROM,
} from "../../../../constants/rom-diff-action-types.constants.js";
import type { WriteRomsDiffOperation } from "../../../../interfaces/write-roms-diff-operation.interface.js";
import getLineSetsToAddAndDeleteFromOldAndNewLists from "../../../build/get-line-sets-to-add-and-delete-from-old-and-new-lists.helper.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../extras/fs/open-file-for-writing.helper.js";
import readUTF8Lines, {
  type ReadUTF8LinesError,
} from "../../../extras/fs/read-utf8-lines.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../extras/fs/write-lines.helper.js";

export type WriteRomsDiffError =
  | ReadUTF8LinesError
  | OpenFileForWritingError
  | WriteLinesError;

const fsExtras = {
  readUTF8Lines,
  openFileForWriting,
  writeLines,
};

const writeRomsDiff = async (
  op: WriteRomsDiffOperation,
): Promise<WriteRomsDiffError | undefined> => {
  const [oldFilenames, listFileReadError] = await fsExtras.readUTF8Lines(
    op.paths.project.list.file,
  );

  if (listFileReadError) return listFileReadError;

  const [diffFileHandle, diffFileOpenError] = await fsExtras.openFileForWriting(
    op.paths.project.diff.file,
    { overwrite: true },
  );
  if (diffFileOpenError) return diffFileOpenError;

  const newFilenames = op.console.roms.selected.entries
    .map(([, rom]) => rom.file.name)
    .toArray();

  const sets = getLineSetsToAddAndDeleteFromOldAndNewLists(
    oldFilenames,
    newFilenames,
  );

  let lines: string[] = [];

  for (const romFilenameToAdd of sets.add) {
    const romToAdd = op.console.roms.selected.get(romFilenameToAdd);
    if (!romToAdd) continue;
    const line = `${ADD_ROM}${DIFF_LINE_SEPARATOR}${romToAdd.fs.type}${DIFF_LINE_SEPARATOR}${romToAdd.file.name}`;
    lines.push(line);
  }

  for (const romFilenameToDelete of sets.delete) {
    const romToDelete = op.console.roms.all.get(romFilenameToDelete);
    if (!romToDelete) continue;
    const line = `${DELETE_ROM}${DIFF_LINE_SEPARATOR}${romToDelete.fs.type}${DIFF_LINE_SEPARATOR}${romToDelete.file.name}`;
    lines.push(line);
  }

  const writeError = await fsExtras.writeLines(diffFileHandle, lines);

  if (writeError) {
    await diffFileHandle.close();
    return writeError;
  }

  await diffFileHandle.close();
};

export default writeRomsDiff;
