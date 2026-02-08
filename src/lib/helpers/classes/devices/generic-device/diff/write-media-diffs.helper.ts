import type { GenericDevicePaths } from "../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import buildWriteMediaNameDiffOperations from "../build/operations/build-write-media-name-diff-operations.helper.js";
import buildMediaDiffPaths from "../build/paths/build-media-diff-paths.helper.js";
import validateDiffPaths, {
  type ValidateDiffPathsError,
} from "../validate/paths/validate-diff-paths.helper.js";
import writeMediaNameDiff from "./write-media-name-diff.helper.js";

export type WriteMediaDiffsError = ValidateDiffPathsError;

const writeMediaDiffs = async (
  paths: GenericDevicePaths,
  consoles: Consoles,
): Promise<WriteMediaDiffsError | undefined> => {
  const diffPaths = buildMediaDiffPaths(paths);
  const ops = buildWriteMediaNameDiffOperations(paths, consoles);

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
      `Processing media diff file for console-media combo ${op.console.name}/${op.media.name}.`,
    );

    const writeError = await writeMediaNameDiff(op);
    if (!writeError) {
      logger.info(
        `Successfully wrote media diff file at ${op.paths.project.diff.file}.`,
      );
      continue;
    }

    logger.warn(
      `Something went wrong while producing the media diff file: `,
      writeError.toString(),
      `Will skip this console-media combo of ${op.console.name}/${op.media.name} on all modes going further.`,
    );

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalMediaName(op.media.name);
  }
};

export default writeMediaDiffs;
