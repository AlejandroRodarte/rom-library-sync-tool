import type { WriteMediaNameDiffOperation } from "../../../../interfaces/write-media-name-diff-operation.interface.js";
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

  const allRomBasenameToFilenamesMap = new Map<string, string[]>();

  for (const rom of op.console.roms.all.values()) {
    const filenames = allRomBasenameToFilenamesMap.get(rom.base.name);
    if (filenames) filenames.push(rom.file.name);
    else allRomBasenameToFilenamesMap.set(rom.base.name, [rom.file.name]);
  }

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
    ...new Set(op.console.roms.selected.values().map((rom) => rom.base.name)),
  ];

  const sets = getLineSetsToAddAndDeleteFromOldAndNewLists(
    oldRomBasenames,
    newRomBasenames,
  );

  let lines: string[] = [];

  for (const basenameToAdd of sets.add) {
    const romFilenames = allRomBasenameToFilenamesMap.get(basenameToAdd);
    if (!romFilenames) continue;

    for (const romFilename of romFilenames) {
      const rom = op.console.roms.selected.get(romFilename);
      if (!rom) continue;
      const line = `add-media|${rom.fs.type}|${rom.base.name}`;
      lines.push(line);
    }
  }

  for (const basenameToDelete of sets.delete) {
    const romFilenames = allRomBasenameToFilenamesMap.get(basenameToDelete);
    if (!romFilenames) continue;

    for (const romFilename of romFilenames) {
      const rom = op.console.roms.selected.get(romFilename);
      if (!rom) continue;
      const line = `delete-media|${rom.fs.type}|${rom.base.name}`;
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
