import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildMediaDiffPaths from "./build-media-diff-paths.helper.js";
import buildWriteMediaNameDiffOperations from "./build-write-media-name-diff-operations.helper.js";
import validateDiffPaths, {
  type ValidateDiffPathsError,
} from "./validate-diff-paths.helper.js";
import writeMediaNameDiff from "./write-media-name-diff.helper.js";

export type WriteMediaDiffsError = ValidateDiffPathsError;

const writeMediaDiffs = async (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
): Promise<WriteMediaDiffsError | undefined> => {
  const diffPaths = buildMediaDiffPaths(paths);
  const ops = buildWriteMediaNameDiffOperations(paths, consoles);

  logger.debug(JSON.stringify(diffPaths, undefined, 2));

  const pathsValidationError = await validateDiffPaths(diffPaths);
  if (pathsValidationError) return pathsValidationError;

  for (const op of ops) {
    const writeError = await writeMediaNameDiff(op);
    if (!writeError) continue;

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalMediaName(op.media.name);
  }
};

export default writeMediaDiffs;
