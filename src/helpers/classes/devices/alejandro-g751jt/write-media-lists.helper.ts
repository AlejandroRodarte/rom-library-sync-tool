import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import buildMediaListPaths from "./build-media-list-paths.helper.js";
import buildWriteMediaNameListOperations from "./build-write-media-name-list-operations.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "./validate-list-paths.helper.js";
import writeMediaNameList from "./write-media-name-list.helper.js";

export type WriteMediaListsError = ValidateListPathsError;

const writeMediaLists = async (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
  fileIOExtras: FileIOExtras,
): Promise<WriteMediaListsError | undefined> => {
  const listPaths = buildMediaListPaths(paths);
  const ops = buildWriteMediaNameListOperations(paths, consoles);

  logger.debug(JSON.stringify(listPaths, undefined, 2));

  const validationError = await validateListPaths(listPaths, fileIOExtras);
  if (validationError) return validationError;

  for (const op of ops) {
    const writeError = await writeMediaNameList(op, fileIOExtras.fileIO.ls);
    if (!writeError) continue;

    const konsole = consoles.get(op.names.console);
    if (!konsole) continue;

    konsole.metadata.skipGlobalMediaName(op.names.media);
  }
};

export default writeMediaLists;
