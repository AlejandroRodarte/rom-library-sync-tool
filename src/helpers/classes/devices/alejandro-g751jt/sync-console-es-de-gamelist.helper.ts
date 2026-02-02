import type {
  AddFilePayload,
  AddMethodError,
  FileIO,
} from "../../../../interfaces/file-io.interface.js";
import type { SyncEsDeGamelistsOperation } from "../../../../interfaces/sync-es-de-gamelists-operation.interface.js";
import environment from "../../../../objects/environment.object.js";
import logger from "../../../../objects/logger.object.js";
import openFileForWriting, {
  type OpenFileForWritingError,
} from "../../../extras/fs/open-file-for-writing.helper.js";

const fsExtras = {
  openFileForWriting,
};

export type SyncConsoleEsDeGamelistError = OpenFileForWritingError;

const syncConsoleEsDeGamelist = async (
  op: SyncEsDeGamelistsOperation,
  fileIO: FileIO,
): Promise<SyncConsoleEsDeGamelistError | undefined> => {
  const args: AddFilePayload = {
    type: "file",
    srcPath: op.paths.project.diff.file,
    dstPath: op.paths.device.file,
    opts: {
      overwrite: true,
    },
  };

  let addError: AddMethodError | undefined;

  logger.info(
    `===== Adding ES-DE Gamelist File =====`,
    `Source XML filepath: ${op.paths.project.diff.file}`,
    `Device XML filepath: ${op.paths.device.file}`,
  );

  if (!environment.options.simulate.sync) addError = await fileIO.add(args);
  if (!addError) return undefined;

  const [failedFileHandle, failedFileError] = await fsExtras.openFileForWriting(
    op.paths.project.failed.file,
    { overwrite: false },
  );

  if (failedFileError) return failedFileError;
  await failedFileHandle.close();
};

export default syncConsoleEsDeGamelist;
