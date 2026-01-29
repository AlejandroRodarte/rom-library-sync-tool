import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildEsDeGamelistsListPaths from "./build-es-de-gamelists-list-paths.helper.js";
import buildWriteEsDeGamelistsListOperations from "./build-write-es-de-gamelists-list-operations.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "./validate-list-paths.helper.js";
import writeEsDeGamelistsList from "./write-es-de-gamelists-list.helper.js";

export type WriteEsDeGamelistsListsError = ValidateListPathsError;

const writeEsDeGamelistsLists = async (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<WriteEsDeGamelistsListsError | undefined> => {
  const listPaths = buildEsDeGamelistsListPaths(paths);
  const ops = buildWriteEsDeGamelistsListOperations(paths, consoles);

  const pathsValidationError = await validateListPaths(listPaths, fileIOExtras);
  if (pathsValidationError) return pathsValidationError;

  for (const op of ops) {
    const writeError = await writeEsDeGamelistsList(
      op,
      fileIOExtras.fileIO.get,
    );
    if (!writeError) continue;

    const konsole = consoles.get(op.names.console);
    if (!konsole) continue;

    konsole.metadata.skipGlobalEsDeGamelist();
  }
};

export default writeEsDeGamelistsLists;
