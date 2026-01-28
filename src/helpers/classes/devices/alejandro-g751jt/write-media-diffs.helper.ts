import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { DiffConsolesData } from "../../../../types/diff-consoles-data.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import buildMediaDiffPaths from "./build-media-diff-paths.helper.js";
import buildWriteMediaNameDiffOperations from "./build-write-media-name-diff-operations.helper.js";
import validateDiffPaths, {
  type ValidateDiffPathsError,
} from "./validate-diff-paths.helper.js";
import writeMediaNameDiff from "./write-media-name-diff.helper.js";

export interface ConsoleMediaName {
  console: ConsoleName;
  media: MediaName;
}

export type WriteMediaDiffsError = ValidateDiffPathsError;

const writeMediaDiffs = async (
  paths: AlejandroG751JTPaths,
  diffConsolesData: DiffConsolesData,
): Promise<
  [ConsoleMediaName[], undefined] | [undefined, WriteMediaDiffsError]
> => {
  const diffPaths = buildMediaDiffPaths(paths);
  const ops = buildWriteMediaNameDiffOperations(paths, diffConsolesData);

  logger.debug(JSON.stringify(diffPaths, undefined, 2));

  const pathValidationError = await validateDiffPaths(diffPaths);

  if (pathValidationError) return [undefined, pathValidationError];

  const consoleMediaNamesToSkip: ConsoleMediaName[] = [];

  for (const op of ops) {
    const writeError = await writeMediaNameDiff(op);
    if (writeError)
      consoleMediaNamesToSkip.push({
        console: op.console.name,
        media: op.media.name,
      });
  }

  return [consoleMediaNamesToSkip, undefined];
};

export default writeMediaDiffs;
