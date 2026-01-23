import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import buildRomsListsDirPaths from "./build-roms-lists-dir-paths.helper.js";
import buildWriteConsoleRomsListOperations from "./build-write-console-roms-list-operations.helper.js";
import validateRomsListsDirs, {
  type ValidateRomsListsDirsError,
} from "./validate-roms-lists-dirs.helper.js";
import writeConsoleRomsList from "./write-console-roms-list.helper.js";

export type WriteRomsListsError = ValidateRomsListsDirsError;

const writeRomsLists = async (
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
  fileIOExtras: FileIOExtras,
): Promise<[ConsoleName[], undefined] | [undefined, WriteRomsListsError]> => {
  const romsDirPaths = buildRomsListsDirPaths(paths.dirs);
  const ops = buildWriteConsoleRomsListOperations(paths, consoleNames);

  const dirsValidationError = await validateRomsListsDirs(
    {
      project: romsDirPaths.project,
      device: [
        ...romsDirPaths.device.base,
        ...ops.map((o) => o.paths.device.dir),
      ],
    },
    fileIOExtras.allDirsExist,
  );

  if (dirsValidationError) return [undefined, dirsValidationError];

  const consolesToSkip: ConsoleName[] = [];
  for (const op of ops) {
    const writeError = await writeConsoleRomsList(op, fileIOExtras.fileIO.ls);
    if (writeError) consolesToSkip.push(op.names.console);
  }

  return [consolesToSkip, undefined];
};

export default writeRomsLists;
