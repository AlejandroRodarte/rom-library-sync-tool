import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildWriteEsDeGamelistsListOperations from "../build/operations/build-write-es-de-gamelists-list-operations.helper.js";
import buildEsDeGamelistsListPaths from "../build/paths/build-es-de-gamelists-list-paths.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "../validate/paths/validate-list-paths.helper.js";
import writeEsDeGamelistsList from "./write-es-de-gamelists-list.helper.js";

export type WriteEsDeGamelistsListsError = ValidateListPathsError;

const writeEsDeGamelistsLists = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<WriteEsDeGamelistsListsError | undefined> => {
  const listPaths = buildEsDeGamelistsListPaths(paths);
  const ops = buildWriteEsDeGamelistsListOperations(paths, consoles);

  logger.debug(`Paths to validate: `, JSON.stringify(listPaths, undefined, 2));

  const pathsValidationError = await validateListPaths(listPaths, fileIOExtras);
  if (pathsValidationError) {
    logger.warn(
      `Something went wrong during path validation: `,
      pathsValidationError.toString(),
    );
    return pathsValidationError;
  }

  for (const op of ops) {
    logger.info(
      `Processing es-de-gamelist file for console ${op.names.console}.`,
    );

    const writeError = await writeEsDeGamelistsList(
      op,
      fileIOExtras.fileIO.get,
    );
    if (!writeError) {
      logger.info(
        `Successfully listed es-de-gamelist file at ${op.paths.project.file}.`,
      );
      continue;
    }

    logger.warn(
      `Something went wrong while producing the es-de-gamelist file.`,
      writeError.toString(),
      `Will skip the "es-de-gamelists" content target for all modes on console ${op.names.console}.`,
    );

    const konsole = consoles.get(op.names.console);
    if (!konsole) continue;

    konsole.metadata.skipGlobalEsDeGamelist();
  }
};

export default writeEsDeGamelistsLists;
