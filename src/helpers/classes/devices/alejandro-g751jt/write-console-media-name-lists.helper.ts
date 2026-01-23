import type { FileIO } from "../../../../interfaces/file-io.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";

const fsExtras = {
  openFileForWriting,
  writeLines,
};

const writeConsoleMediaNameLists = async (
  ops: WriteConsoleMediaNameListOperation[],
  ls: FileIO["ls"],
) => {
  for (const op of ops) {
    const [lsEntries, lsError] = await ls(op.paths.device.dir);

    if (lsError) {
      // skipConsoleMediaName(op.names.console, op.names.media);
      continue;
    }

    const filenames = lsEntries.map((e) => e.name);

    const [listFileHandle, listFileError] = await fsExtras.openFileForWriting(
      op.paths.project.file,
      { overwrite: true },
    );

    if (listFileError) {
      // skipConsoleMediaName(op.names.console, op.names.media);
      continue;
    }

    const writeLinesError = await fsExtras.writeLines(
      listFileHandle,
      filenames,
      "utf8",
    );

    if (writeLinesError) {
      await listFileHandle.close();
      // skipConsoleMediaName(op.names.console, op.names.media);
      continue;
    }

    await listFileHandle.close();
  }
};

export default writeConsoleMediaNameLists;
