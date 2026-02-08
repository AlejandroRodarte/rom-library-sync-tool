import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildWriteRomsListOperations from "../build/operations/build-write-roms-list-operations.helper.js";
import buildRomsListPaths from "../build/paths/build-roms-list-paths.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "../validate/paths/validate-list-paths.helper.js";
import writeRomsList from "./write-roms-list.helper.js";

export type WriteRomsListsError = ValidateListPathsError;

const writeRomsLists = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<WriteRomsListsError | undefined> => {
  const listPaths = buildRomsListPaths(paths);
  const ops = buildWriteRomsListOperations(paths, consoles);

  logger.debug(`Paths to validate: `, JSON.stringify(listPaths, undefined, 2));

  const dirsValidationError = await validateListPaths(listPaths, fileIOExtras);
  if (dirsValidationError) {
    logger.warn(
      `Something went wrong during path validation: `,
      dirsValidationError.toString(),
    );
    return dirsValidationError;
  }

  for (const op of ops) {
    logger.info(
      `Processing ROMs list operation for console ${op.names.console}.`,
    );

    const writeError = await writeRomsList(op, fileIOExtras.fileIO.ls);
    if (!writeError) {
      logger.info(
        `Successfully produced ROMs list file at ${op.paths.project.file}.`,
      );
      continue;
    }

    logger.warn(
      `Something went wrong while producing ROMs list file: `,
      writeError.toString(),
      `Will skip "roms" content target (for all modes) for console ${op.names.console}.`,
    );

    const konsole = consoles.get(op.names.console);
    if (!konsole) continue;

    konsole.metadata.skipGlobalRoms();
  }
};

export default writeRomsLists;
