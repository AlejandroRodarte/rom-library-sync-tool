import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../interfaces/devices/generic-device/generic-device-paths.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildEsDeGamelistsSyncPaths from "./build-es-de-gamelists-sync-paths.helper.js";
import buildSyncEsDeGamelistsOperations from "./build-sync-es-de-gamelists-operations.helper.js";
import syncConsoleEsDeGamelist from "./sync-console-es-de-gamelist.helper.js";
import validateSyncPaths, {
  type ValidateSyncPathsError,
} from "./validate-sync-paths.helper.js";

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
