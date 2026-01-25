import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";
import type { WriteMediaNameListOperation } from "../../../../interfaces/write-media-name-list-operation.interface.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";
import buildMediaListsDirPaths from "./build-media-lists-dir-paths.helper.js";
import buildWriteMediaNameListOperations from "./build-write-media-name-list-operations.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "./validate-list-paths.helper.js";
import writeMediaNameList from "./write-media-name-list.helper.js";

export type WriteMediaListsError = ValidateListPathsError;

const writeMediaLists = async (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
  fileIOExtras: FileIOExtras,
): Promise<
  | [WriteMediaNameListOperation["names"][], undefined]
  | [undefined, WriteMediaListsError]
> => {
  const mediaDirPaths = buildMediaListsDirPaths(paths.dirs);
  const ops = buildWriteMediaNameListOperations(paths, consolesData);

  const listPaths: ListPaths = {
    project: {
      dirs: mediaDirPaths.project,
    },
    device: {
      dirs: [
        ...mediaDirPaths.device.base,
        ...ops.map((o) => o.paths.device.dir),
      ],
    },
  };

  const validationError = await validateListPaths(
    listPaths,
    fileIOExtras.allDirsExist,
  );

  if (validationError) return [undefined, validationError];

  const consoleMediaNamesToSkip: WriteMediaNameListOperation["names"][] = [];

  for (const op of ops) {
    const writeError = await writeMediaNameList(op, fileIOExtras.fileIO.ls);
    if (writeError) consoleMediaNamesToSkip.push(op.names);
  }

  return [consoleMediaNamesToSkip, undefined];
};

export default writeMediaLists;
