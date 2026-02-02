import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildRomsSyncPaths from "./build-roms-sync-paths.helper.js";
import validateSyncPaths, {
  type ValidateSyncPathsError,
} from "./validate-sync-paths.helper.js";
import buildSyncRomsOperations from "./build-sync-roms-operations.helper.js";
import syncConsoleRoms from "./sync-console-roms.helper.js";

export type SyncRomsError = ValidateSyncPathsError;

const syncRoms = async (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<SyncRomsError | undefined> => {
  const syncPaths = buildRomsSyncPaths(paths);
  const pathsValidationError = await validateSyncPaths(syncPaths, fileIOExtras);
  if (pathsValidationError) return pathsValidationError;

  const ops = buildSyncRomsOperations(paths, consoles);

  for (const op of ops) {
    const syncError = await syncConsoleRoms(op, fileIOExtras.fileIO);
    if (!syncError) continue;

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalRoms();
  }
};

export default syncRoms;
