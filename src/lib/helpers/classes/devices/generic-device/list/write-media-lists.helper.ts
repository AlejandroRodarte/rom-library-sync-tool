import type FileIOExtras from "../../../../../classes/file-io/file-io-extras.class.js";
import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildWriteMediaNameListOperations from "../build/operations/build-write-media-name-list-operations.helper.js";
import buildMediaListPaths from "../build/paths/build-media-list-paths.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "../validate/paths/validate-list-paths.helper.js";
import writeMediaNameList from "./write-media-name-list.helper.js";

export type WriteMediaListsError = ValidateListPathsError;

const writeMediaLists = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<WriteMediaListsError | undefined> => {
  const listPaths = buildMediaListPaths(paths);
  const ops = buildWriteMediaNameListOperations(paths, consoles);

  logger.debug(`Paths to validate: `, JSON.stringify(listPaths, undefined, 2));

  const validationError = await validateListPaths(listPaths, fileIOExtras);
  if (validationError) {
    logger.warn(
      `Something went wrong during path validation.`,
      validationError.toString(),
    );
    return validationError;
  }

  for (const op of ops) {
    logger.info(
      `Processing media list operation for console-media combo ${op.names.console}/${op.names.media}.`,
    );

    const writeError = await writeMediaNameList(op, fileIOExtras.fileIO.ls);
    if (!writeError) {
      logger.info(
        `Successfuly built media list file at ${op.paths.project.file}.`,
      );
      continue;
    }

    logger.warn(
      `Something went wrong while producing the media list file.`,
      writeError.toString(),
      `Will skip console-media combo ${op.names.console}/${op.names.media} for all modes.`,
    );

    const konsole = consoles.get(op.names.console);
    if (!konsole) continue;

    konsole.metadata.skipGlobalMediaName(op.names.media);
  }
};

export default writeMediaLists;
