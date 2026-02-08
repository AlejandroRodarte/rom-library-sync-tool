import type { SyncMediaOperation } from "../../../../../interfaces/classes/devices/generic-device/operations/sync-media-operation.interface.js";
import type { FileIO } from "../../../../../interfaces/file-io.interface.js";
import logger from "../../../../../objects/logger.object.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../../extras/fs/open-file-for-writing.helper.js";
import readUTF8Lines, {
  type ReadUTF8LinesError,
} from "../../../../extras/fs/read-utf8-lines.helper.js";
import writeLines, {
  type WriteLinesError,
} from "../../../../extras/fs/write-lines.helper.js";
import unlink, {
  type UnlinkError,
} from "../../../../wrappers/modules/fs/unlink.helper.js";
import mediaDiffActionsFromMediaDiffLines from "../build/media/build-media-diff-actions-from-media-diff-lines.helper.js";
import buildMediaDiffLineFromMediaDiffAction from "../build/media/build-media-diff-line-from-media-diff-action.helper.js";
import syncMediaDiffAction from "./sync-media-diff-action.helper.js";

const fsExtras = {
  openFileForWriting,
  readUTF8Lines,
  unlink,
  writeLines,
};

export type SyncConsoleMediaNameError =
  | OpenFileForWritingError
  | ReadUTF8LinesError
  | UnlinkError
  | WriteLinesError;

const syncConsoleMediaName = async (
  op: SyncMediaOperation,
  fileIO: FileIO,
): Promise<SyncConsoleMediaNameError | undefined> => {
  const [failedFileHandle, failedFileError] = await fsExtras.openFileForWriting(
    op.paths.project.failed.file,
    { overwrite: false },
  );
  if (failedFileError) return failedFileError;

  const [diffLines, diffReadError] = await fsExtras.readUTF8Lines(
    op.paths.project.diff.file,
  );
  if (diffReadError) return diffReadError;

  const [mediaDiffActions, parsingFailedLines] =
    mediaDiffActionsFromMediaDiffLines(diffLines);
  const failedDiffLines = [...parsingFailedLines];

  for (const mediaDiffAction of mediaDiffActions) {
    logger.info(
      `----- Processing Media Diff Action -----`,
      `Action type: ${mediaDiffAction.type}`,
      `Media filesystem type: ${mediaDiffAction.data.fs.type}`,
      `Media filename: ${mediaDiffAction.data.filename}`,
    );

    const syncDiffActionError = await syncMediaDiffAction(
      mediaDiffAction,
      {
        db: op.paths.db.dir,
        device: op.paths.device.dir,
      },
      fileIO,
    );

    if (syncDiffActionError) {
      logger.warn(
        `Failed to synchronize this diff action: `,
        syncDiffActionError.toString(),
        `Will add this to the failed diff line list.`,
      );
      failedDiffLines.push(
        buildMediaDiffLineFromMediaDiffAction(mediaDiffAction),
      );
    } else logger.info(`Successfully processed this diff action. Continuing.`);
  }

  if (failedDiffLines.length === 0) {
    logger.info(
      `No failures occured during synchronization. Deleting empty failed file at ${op.paths.project.failed.file}.`,
    );
    await failedFileHandle.close();
    const unlinkError = await fsExtras.unlink(op.paths.project.failed.file);
    if (unlinkError) return unlinkError;
    return undefined;
  }

  logger.info(
    `Failures that occured during synchronization: ${failedDiffLines.length}. Will write them into failed file at ${op.paths.project.failed.file}.`,
  );

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

export default syncConsoleMediaName;
