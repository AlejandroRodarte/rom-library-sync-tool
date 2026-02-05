import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildSyncEsDeGamelistsOperations from "../build/operations/build-sync-es-de-gamelists-operations.helper.js";
import buildEsDeGamelistsSyncPaths from "../build/paths/build-es-de-gamelists-sync-paths.helper.js";
import validateSyncPaths, {
  type ValidateSyncPathsError,
} from "../validate/paths/validate-sync-paths.helper.js";
import syncConsoleEsDeGamelist from "./sync-console-es-de-gamelist.helper.js";

export type SyncEsDeGamelistsError = ValidateSyncPathsError;

const syncEsDeGamelists = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<SyncEsDeGamelistsError | undefined> => {
  const syncPaths = buildEsDeGamelistsSyncPaths(paths);
  const pathsValidationError = await validateSyncPaths(syncPaths, fileIOExtras);
  if (pathsValidationError) return pathsValidationError;

  const ops = buildSyncEsDeGamelistsOperations(paths, consoles);

  for (const op of ops) {
    const syncError = await syncConsoleEsDeGamelist(op, fileIOExtras.fileIO);
    if (!syncError) continue;

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalEsDeGamelist();
  }
};

export default syncEsDeGamelists;
