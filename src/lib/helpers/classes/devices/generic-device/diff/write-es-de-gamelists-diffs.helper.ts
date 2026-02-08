import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildWriteEsDeGamelistsDiffOperations from "../build/operations/build-write-es-de-gamelists-diff-operations.helper.js";
import buildEsDeGamelistsDiffPaths from "../build/paths/build-es-de-gamelists-diff-paths.helper.js";
import validateDiffPaths, {
  type ValidateDiffPathsError,
} from "../validate/paths/validate-diff-paths.helper.js";
import writeEsDeGamelistsDiff from "./write-es-de-gamelists-diff.helper.js";

export type WriteEsDeGamelistsDiffsError = ValidateDiffPathsError;

const writeEsDeGamelistsDiffs = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
): Promise<WriteEsDeGamelistsDiffsError | undefined> => {
  const diffPaths = buildEsDeGamelistsDiffPaths(paths);
  const ops = buildWriteEsDeGamelistsDiffOperations(paths, consoles);

  logger.debug(`Paths to validate: `, JSON.stringify(diffPaths, undefined, 2));

  const pathsValidationError = await validateDiffPaths(diffPaths);
  if (pathsValidationError) {
    logger.warn(
      `Something went wrong during path validation: `,
      pathsValidationError.toString(),
    );
    return pathsValidationError;
  }

  for (const op of ops) {
    logger.info(
      `Processing es-de-gamelist diff file for console ${op.console.name}.`,
    );

    const writeError = await writeEsDeGamelistsDiff(op);
    if (!writeError) {
      logger.info(
        `Successfully wrote es-de-gamelist diff file at ${op.paths.project.diff.file}.`,
      );
      continue;
    }

    logger.info(
      `Something went wrong while producing the es-de-gamelist diff file.`,
      writeError.toString(),
      `Will skip the "es-de-gamelist" content target for console ${op.console.name} on all modes.`,
    );

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalEsDeGamelist();
  }
};

export default writeEsDeGamelistsDiffs;
