import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";
import buildEsDeGamelistsListPaths from "./build-es-de-gamelists-list-paths.helper.js";
import buildWriteEsDeGamelistsListOperations from "./build-write-es-de-gamelists-list-operations.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "./validate-list-paths.helper.js";
import writeEsDeGamelistsList from "./write-es-de-gamelists-list.helper.js";

export type WriteEsDeGamelistsListsError = ValidateListPathsError;

const writeEsDeGamelistsLists = async (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
  fileIOExtras: FileIOExtras,
): Promise<
  [ConsoleName[], undefined] | [undefined, WriteEsDeGamelistsListsError]
> => {
  const listPaths = buildEsDeGamelistsListPaths(paths);
  const ops = buildWriteEsDeGamelistsListOperations(paths, consolesData);

  const pathsValidationError = await validateListPaths(listPaths, fileIOExtras);
  if (pathsValidationError) return [undefined, pathsValidationError];

  const consolesToSkip: ConsoleName[] = [];
  for (const op of ops) {
    const writeError = await writeEsDeGamelistsList(
      op,
      fileIOExtras.fileIO.get,
    );
    if (writeError) consolesToSkip.push(op.names.console);
  }

  return [consolesToSkip, undefined];
};

export default writeEsDeGamelistsLists;
