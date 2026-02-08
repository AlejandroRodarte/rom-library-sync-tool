import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildSyncRomsOperations from "../build/operations/build-sync-roms-operations.helper.js";
import buildRomsSyncPaths from "../build/paths/build-roms-sync-paths.helper.js";
import validateSyncPaths, {
  type ValidateSyncPathsError,
} from "../validate/paths/validate-sync-paths.helper.js";
import syncConsoleRoms from "./sync-console-roms.helper.js";

export type SyncRomsError = ValidateSyncPathsError;

const syncRoms = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<SyncRomsError | undefined> => {
  const syncPaths = buildRomsSyncPaths(paths);
  logger.debug(`Paths to validate: `, JSON.stringify(syncPaths, undefined, 2));

  const pathsValidationError = await validateSyncPaths(syncPaths, fileIOExtras);
  if (pathsValidationError) {
    logger.warn(
      `Something went wrong during path validation: `,
      pathsValidationError.toString(),
    );
    return pathsValidationError;
  }

  const ops = buildSyncRomsOperations(paths, consoles);

  for (const op of ops) {
    logger.info(
      `Beginning sync operation for console ${op.console.name}.`,
      `DB path: ${op.paths.db.dir}.`,
      `Device path: ${op.paths.device.dir}.`,
    );

    const syncError = await syncConsoleRoms(op, fileIOExtras.fileIO);
    if (!syncError) {
      logger.info(`Finished synchronizing for console ${op.console.name}.`);
      continue;
    }

    logger.warn(
      `Something went wrong while synchronizing: `,
      syncError.toString(),
      `Will skip "roms" content target for console ${op.console.name} on all modes going forward.`,
    );

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalRoms();
  }
};

export default syncRoms;
