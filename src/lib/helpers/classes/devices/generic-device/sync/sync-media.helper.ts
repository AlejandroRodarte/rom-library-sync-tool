import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildSyncMediaOperations from "../build/operations/build-sync-media-operations.helper.js";
import buildMediaSyncPaths from "../build/paths/build-media-sync-paths.helper.js";
import validateSyncPaths, {
  type ValidateSyncPathsError,
} from "../validate/paths/validate-sync-paths.helper.js";
import syncConsoleMediaName from "./sync-console-media-name.helper.js";

export type SyncMediaError = ValidateSyncPathsError;

const syncMedia = async (
  paths: GenericDevicePaths,
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
