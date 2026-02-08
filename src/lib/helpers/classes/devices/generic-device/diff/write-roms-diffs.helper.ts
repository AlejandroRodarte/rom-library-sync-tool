import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildWriteRomsDiffOperations from "../build/operations/build-write-roms-diff-operations.helper.js";
import buildRomsDiffsDirPaths from "../build/paths/build-roms-diff-paths.helper.js";
import validateDiffPaths, {
  type ValidateDiffPathsError,
} from "../validate/paths/validate-diff-paths.helper.js";
import writeRomsDiff from "./write-roms-diff.helper.js";

export type WriteRomsDiffsError = ValidateDiffPathsError;

const writeRomsDiffs = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
): Promise<WriteRomsDiffsError | undefined> => {
  const diffPaths = buildRomsDiffsDirPaths(paths);
  const ops = buildWriteRomsDiffOperations(paths, consoles);

  logger.debug(`Paths to validate: `, JSON.stringify(diffPaths, undefined, 2));

  const pathsValidationError = await validateDiffPaths(diffPaths);
  if (pathsValidationError) {
    logger.warn(
      `Something went wrong during path validation:`,
      pathsValidationError.toString(),
    );
    return pathsValidationError;
  }

  for (const op of ops) {
    logger.info(`Processing ROMs diff file for console ${op.console.name}.`);

    const writeError = await writeRomsDiff(op);
    if (!writeError) {
      logger.info(
        `Successfully built ROMs diff file at ${op.paths.project.diff.file}.`,
      );
      continue;
    }

    logger.warn(
      `Something went wrong while producing the ROMs diff file: `,
      writeError.toString(),
      `Will skip the "roms" content target for all modes on console ${op.console.name}.`,
    );

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalRoms();
  }
};

export default writeRomsDiffs;
