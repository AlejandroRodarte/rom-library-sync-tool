import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import buildRomsListsDirPaths from "./build-roms-lists-dir-paths.helper.js";
import buildWriteRomsListOperations from "./build-write-roms-list-operations.helper.js";
import validateListPaths, {
  type ValidateListPathsError,
} from "./validate-list-paths.helper.js";
import writeRomsList from "./write-roms-list.helper.js";

export type WriteRomsListsError = ValidateListPathsError;

const writeRomsLists = async (
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
  fileIOExtras: FileIOExtras,
): Promise<[ConsoleName[], undefined] | [undefined, WriteRomsListsError]> => {
  const romsDirPaths = buildRomsListsDirPaths(paths.dirs);
  const ops = buildWriteRomsListOperations(paths, consoleNames);

  const listPaths: ListPaths = {
    project: {
      dirs: romsDirPaths.project,
    },
    device: {
      dirs: [
        ...romsDirPaths.device.base,
        ...ops.map((o) => o.paths.device.dir),
      ],
    },
  };
  const dirsValidationError = await validateListPaths(
    listPaths,
    fileIOExtras.allDirsExist,
  );

  if (dirsValidationError) return [undefined, dirsValidationError];

  const consolesToSkip: ConsoleName[] = [];
  for (const op of ops) {
    const writeError = await writeRomsList(op, fileIOExtras.fileIO.ls);
    if (writeError) consolesToSkip.push(op.names.console);
  }

  return [consolesToSkip, undefined];
};

export default writeRomsLists;
