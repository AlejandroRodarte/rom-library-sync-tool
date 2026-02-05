import DIFF_LINE_SEPARATOR from "../../../../../constants/diff-line-separator.constant.js";
import { DIR, FILE } from "../../../../../constants/fs/fs-types.constants.js";
import {
  ADD_MEDIA,
  DELETE_MEDIA,
} from "../../../../../constants/media/media-diff-action-types.constants.js";
import type { WriteMediaNameDiffOperation } from "../../../../../interfaces/classes/devices/generic-device/operations/write-media-name-diff-operation.interface.js";
import buildLineSetsToAddAndDeleteFromOldAndNewLists from "../../../../build/build-line-sets-to-add-and-delete-from-old-and-new-lists.helper.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../../extras/fs/open-file-for-writing.helper.js";
import readUTF8Lines, {
  type ReadUTF8LinesError,
} from "../../../../extras/fs/read-utf8-lines.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../../extras/fs/write-lines.helper.js";

const fsExtras = {
  readUTF8Lines,
  openFileForWriting,
  writeLines,
};

export type WriteMediaNameDiff =
  | ReadUTF8LinesError
  | OpenFileForWritingError
  | WriteLinesError;

const writeMediaNameDiff = async (op: WriteMediaNameDiffOperation) => {
  const [oldFilenames, listFileReadError] = await fsExtras.readUTF8Lines(
    op.paths.project.list.file,
  );
  if (listFileReadError) return listFileReadError;

  const [diffFileHandle, diffFileOpenError] = await fsExtras.openFileForWriting(
    op.paths.project.diff.file,
    { overwrite: true },
  );
  if (diffFileOpenError) return diffFileOpenError;

  const oldRomBasenames = [
    ...new Set(
      oldFilenames.map((filename) => {
        const lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex === -1) return filename;
        const basename = filename.substring(0, lastDotIndex);
        return basename;
      }),
    ),
  ];

  const newRomBasenames = [
    ...new Set(
      op.console.roms.selected.entries.map(([, rom]) => rom.base.name),
    ),
  ];

  const sets = buildLineSetsToAddAndDeleteFromOldAndNewLists(
    oldRomBasenames,
    newRomBasenames,
  );

  let lines: string[] = [];

  for (const basenameToAdd of sets.add) {
    const mediaEntries = op.media.entries.get(basenameToAdd);
    if (!mediaEntries) continue;

    for (const mediaEntry of mediaEntries) {
      let line: string;

      switch (mediaEntry.type) {
        case FILE:
          const mediaFilename = `${basenameToAdd}.${mediaEntry.file.type}`;
          line = `${ADD_MEDIA}${DIFF_LINE_SEPARATOR}${FILE}${DIFF_LINE_SEPARATOR}${mediaFilename}`;
          break;
        case DIR:
          line = `${ADD_MEDIA}${DIFF_LINE_SEPARATOR}${DIR}${DIFF_LINE_SEPARATOR}${basenameToAdd}`;
          break;
      }

      lines.push(line);
    }
  }

  for (const basenameToDelete of sets.delete) {
    const mediaEntries = op.media.entries.get(basenameToDelete);
    if (!mediaEntries) continue;

    for (const mediaEntry of mediaEntries) {
      let line: string;

      switch (mediaEntry.type) {
        case FILE:
          const mediaFilename = `${basenameToDelete}.${mediaEntry.file.type}`;
          line = `${DELETE_MEDIA}${DIFF_LINE_SEPARATOR}${FILE}${DIFF_LINE_SEPARATOR}${mediaFilename}`;
          break;
        case DIR:
          line = `${DELETE_MEDIA}${DIFF_LINE_SEPARATOR}${DIR}${DIFF_LINE_SEPARATOR}${basenameToDelete}`;
      }

      lines.push(line);
    }
  }

  const writeError = await fsExtras.writeLines(diffFileHandle, lines);

  if (writeError) {
    await diffFileHandle.close();
    return writeError;
  }

  await diffFileHandle.close();
};

export default writeMediaNameDiff;
