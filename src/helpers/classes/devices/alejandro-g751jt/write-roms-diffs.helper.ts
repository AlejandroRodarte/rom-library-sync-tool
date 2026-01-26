import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { DiffPaths } from "../../../../interfaces/diff-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { DiffConsolesData } from "../../../../types/diff-consoles-data.type.js";
import buildRomsDiffsDirPaths from "./build-roms-diffs-dir-paths.helper.js";
import buildWriteRomsDiffOperations from "./build-write-roms-diff-operations.helper.js";
import validateDiffPaths, {
  type ValidateDiffPathsError,
} from "./validate-diff-paths.helper.js";
import writeRomsDiff, {
  type WriteRomsDiffError,
} from "./write-roms-diff.helper.js";

export type WriteRomsDiffsError = ValidateDiffPathsError;

const writeRomsDiffs = async (
  paths: AlejandroG751JTPaths,
  diffConsolesData: DiffConsolesData,
): Promise<[ConsoleName[], undefined] | [undefined, WriteRomsDiffError]> => {
  const romsDirPaths = buildRomsDiffsDirPaths(paths.dirs);
  const ops = buildWriteRomsDiffOperations(
    paths.files.project,
    diffConsolesData,
  );

  const diffPaths: DiffPaths = {
    project: {
      list: {
        dirs: romsDirPaths.project.lists,
        files: ops.map((o) => o.paths.project.list.file),
      },
      diff: {
        dirs: romsDirPaths.project.diffs,
      },
    },
  };

  logger.debug(JSON.stringify(diffPaths, undefined, 2));

  const pathsValidationError = await validateDiffPaths(diffPaths);
  if (pathsValidationError) return [undefined, pathsValidationError];

  const consolesToSkip: ConsoleName[] = [];
  for (const op of ops) {
    const writeError = await writeRomsDiff(op);
    if (writeError) consolesToSkip.push(op.console.name);
  }

  return [consolesToSkip, undefined];
};

export default writeRomsDiffs;
