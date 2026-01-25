import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { ConsoleRoms } from "../../../../types/console-roms.type.js";
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
  consoles: ConsoleRoms,
): Promise<[ConsoleName[], undefined] | [undefined, WriteRomsDiffError]> => {
  const romsDirPaths = buildRomsDiffsDirPaths(paths.dirs);
  const ops = buildWriteRomsDiffOperations(paths.files.project, consoles);

  const pathsValidationError = await validateDiffPaths({
    project: {
      list: {
        dirs: romsDirPaths.project.lists,
        files: ops.map((o) => o.paths.project.list.file),
      },
      diff: {
        dirs: romsDirPaths.project.diffs,
      },
    },
  });
  if (pathsValidationError) return [undefined, pathsValidationError];

  const consolesToSkip: ConsoleName[] = [];
  for (const op of ops) {
    const writeError = await writeRomsDiff(op);
    if (writeError) consolesToSkip.push(op.console.name);
  }

  return [consolesToSkip, undefined];
};

export default writeRomsDiffs;
