import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildMediaSyncPaths from "./build-media-sync-paths.helper.js";
import buildSyncMediaOperations from "./build-sync-media-operations.helper.js";
import syncConsoleMediaName from "./sync-console-media-name.helper.js";
import validateSyncPaths, {
  type ValidateSyncPathsError,
} from "./validate-sync-paths.helper.js";

export type SyncMediaError = ValidateSyncPathsError;

const syncMedia = async (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<SyncMediaError | undefined> => {
  const syncPaths = buildMediaSyncPaths(paths);
  const pathsValidationError = await validateSyncPaths(syncPaths, fileIOExtras);
  if (pathsValidationError) return pathsValidationError;

  const ops = buildSyncMediaOperations(paths, consoles);

  for (const op of ops) {
    const syncError = await syncConsoleMediaName(op, fileIOExtras.fileIO);
    if (!syncError) continue;

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalMediaName(op.media.name);
  }
};

export default syncMedia;
