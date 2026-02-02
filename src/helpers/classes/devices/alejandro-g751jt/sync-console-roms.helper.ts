import type { FileIO } from "../../../../interfaces/file-io.interface.js";
import type { SyncRomsOperation } from "../../../../interfaces/sync-roms-operation.interface.js";
import romDiffActionsFromRomDiffLines from "../../../build/rom-diff-actions-from-rom-diff-lines.helper.js";
import romDiffLineFromRomDiffAction from "../../../build/rom-diff-line-from-rom-diff-action.helper.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../extras/fs/open-file-for-writing.helper.js";
import readUTF8Lines, {
  type ReadUTF8LinesError,
} from "../../../extras/fs/read-utf8-lines.helper.js";
import syncRomDiffAction from "./sync-rom-diff-action.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../extras/fs/write-lines.helper.js";
import unlink, {
  type UnlinkError,
} from "../../../wrappers/modules/fs/unlink.helper.js";

const fsExtras = {
  openFileForWriting,
  readUTF8Lines,
  unlink,
  writeLines,
};

const build = {
  romDiffActionsFromRomDiffLines,
  romDiffLineFromRomDiffAction,
};

export type SyncConsoleRomsError =
  | OpenFileForWritingError
  | ReadUTF8LinesError
  | UnlinkError
  | WriteLinesError;

const syncConsoleRoms = async (
  op: SyncRomsOperation,
  fileIO: FileIO,
): Promise<SyncConsoleRomsError | undefined> => {
  const [failedFileHandle, failedFileError] = await fsExtras.openFileForWriting(
    op.paths.project.failed.file,
    {
      overwrite: false,
    },
  );
  if (failedFileError) return failedFileError;

  const [diffLines, diffReadError] = await fsExtras.readUTF8Lines(
    op.paths.project.diff.file,
  );
  if (diffReadError) return diffReadError;

  const [romDiffActions, parsingFailedLines] =
    build.romDiffActionsFromRomDiffLines(diffLines);
  const failedDiffLines = [...parsingFailedLines];

  for (const romDiffAction of romDiffActions) {
    const syncDiffActionError = await syncRomDiffAction(
      romDiffAction,
      {
        db: op.paths.db.dir,
        device: op.paths.device.dir,
      },
      fileIO,
    );

    if (syncDiffActionError)
      failedDiffLines.push(build.romDiffLineFromRomDiffAction(romDiffAction));
  }

  if (failedDiffLines.length === 0) {
    await failedFileHandle.close();
    const unlinkError = await fsExtras.unlink(op.paths.project.failed.file);
    if (unlinkError) return unlinkError;
  }

  const writeFailedLinesError = await fsExtras.writeLines(
    failedFileHandle,
    failedDiffLines,
    "utf8",
  );

  if (writeFailedLinesError) {
    await failedFileHandle.close();
    return writeFailedLinesError;
  }

  await failedFileHandle.close();
};

export default syncConsoleRoms;
