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

  const pathsValidationError = await validateDiffPaths(diffPaths);
  if (pathsValidationError) return pathsValidationError;

  logger.debug(JSON.stringify(diffPaths, undefined, 2));

  for (const op of ops) {
    const writeError = await writeEsDeGamelistsDiff(op);
    if (!writeError) continue;

    const konsole = consoles.get(op.console.name);
    if (!konsole) continue;

    konsole.metadata.skipGlobalEsDeGamelist();
  }
};

export default writeEsDeGamelistsDiffs;
