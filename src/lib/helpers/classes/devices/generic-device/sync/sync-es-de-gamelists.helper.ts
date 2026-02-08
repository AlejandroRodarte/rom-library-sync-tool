import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
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
  logger.debug(`Paths to validate: `, JSON.stringify(syncPaths, undefined, 2));

  const pathsValidationError = await validateSyncPaths(syncPaths, fileIOExtras);
  if (pathsValidationError) {
    logger.warn(
      `Something went wrong during path validation: `,
      pathsValidationError.toString(),
    );
    return pathsValidationError;
  }

  const ops = buildSyncEsDeGamelistsOperations(paths, consoles);

  for (const op of ops) {
    logger.info(
      `Syncing es-de-gamelist file for console ${op.console.name}.`,
      `Device path: ${op.paths.device.file}.`,
    );

    const syncError = await syncConsoleEsDeGamelist(op, fileIOExtras.fileIO);
    if (!syncError) {
      logger.info(
        `Successfully copied over es-de-gamelist file to device path ${op.paths.device.file}.`,
      );
      continue;
    }

    logger.warn(
      `Something went wrong while copying over the new es-de-gamelist file.`,
      syncError.toString(),
      `Will skip the "es-de-gamelists" content target for console ${op.console.name} on all modes going forward.`,
    );

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalEsDeGamelist();
  }
};

export default syncEsDeGamelists;
