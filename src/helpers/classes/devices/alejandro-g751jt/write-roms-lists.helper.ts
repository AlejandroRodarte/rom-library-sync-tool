import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildRomsListPaths from "./build-roms-list-paths.helper.js";
import buildWriteRomsListOperations from "./build-write-roms-list-operations.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "./validate-list-paths.helper.js";
import writeRomsList from "./write-roms-list.helper.js";

export type WriteRomsListsError = ValidateListPathsError;

const writeRomsLists = async (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<WriteRomsListsError | undefined> => {
  const listPaths = buildRomsListPaths(paths);
  const ops = buildWriteRomsListOperations(paths, consoles);

  logger.debug(JSON.stringify(listPaths, undefined, 2));

  const dirsValidationError = await validateListPaths(listPaths, fileIOExtras);

  if (dirsValidationError) return dirsValidationError;

  for (const op of ops) {
    const writeError = await writeRomsList(op, fileIOExtras.fileIO.ls);
    if (!writeError) continue;

    const konsole = consoles.get(op.names.console);
    if (!konsole) continue;

    konsole.metadata.skipGlobalRoms();
  }
};

export default writeRomsLists;
