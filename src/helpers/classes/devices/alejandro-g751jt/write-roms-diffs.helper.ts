import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildRomsDiffsDirPaths from "./build-roms-diff-paths.helper.js";
import buildWriteRomsDiffOperations from "./build-write-roms-diff-operations.helper.js";
import validateDiffPaths, {
  type ValidateDiffPathsError,
} from "./validate-diff-paths.helper.js";
import writeRomsDiff from "./write-roms-diff.helper.js";

export type WriteRomsDiffsError = ValidateDiffPathsError;

const writeRomsDiffs = async (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
): Promise<WriteRomsDiffsError | undefined> => {
  const diffPaths = buildRomsDiffsDirPaths(paths);
  const ops = buildWriteRomsDiffOperations(paths.files.project, consoles);

  const pathsValidationError = await validateDiffPaths(diffPaths);
  if (pathsValidationError) return pathsValidationError;

  for (const op of ops) {
    const writeError = await writeRomsDiff(op);
    if (!writeError) continue;

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalRoms();
  }
};

export default writeRomsDiffs;
