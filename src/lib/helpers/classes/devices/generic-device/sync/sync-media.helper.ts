import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
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
  logger.debug(`Paths to validate: `, JSON.stringify(syncPaths, undefined, 2));

  const pathsValidationError = await validateSyncPaths(syncPaths, fileIOExtras);
  if (pathsValidationError) {
    logger.warn(
      `Something went wrong during path validation: `,
      pathsValidationError.toString(),
    );
    return pathsValidationError;
  }

  const ops = buildSyncMediaOperations(paths, consoles);

  for (const op of ops) {
    logger.info(
      `Beginning synchronization of console-media combo ${op.console.name}/${op.media.name}.`,
      `DB path: ${op.paths.db.dir}.`,
      `Device path: ${op.paths.device.dir}.`,
    );

    const syncError = await syncConsoleMediaName(op, fileIOExtras.fileIO);
    if (!syncError) {
      logger.info(
        `Finished synchronizing console-media combo ${op.console.name}/${op.media.name}.`,
      );
      continue;
    }

    logger.warn(
      `Something went wrong during synchronization: `,
      syncError.toString(),
      `Will skip console-media combo ${op.console.name}/${op.media.name} on all modes going further.`,
    );

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalMediaName(op.media.name);
  }
};

export default syncMedia;
