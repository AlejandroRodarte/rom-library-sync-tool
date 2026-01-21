import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
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
  const dirsValidationError = await validateRomsListsDirs(
    paths.dirs,
    consoleNames,
    fileIOExtras.allDirsExist,
  );

  if (dirsValidationError) return [undefined, dirsValidationError];

  const skipConsoles: ConsoleName[] = [];

  for (const consoleName of consoleNames) {
    const deviceDir = paths.dirs["content-targets"].roms.consoles[consoleName];

    if (!deviceDir) {
      logger.warn(
        `Device dirpath for console ${consoleName} not found. Skipping this console when processing ROMs.`,
      );

      skipConsoles.push(consoleName);
      continue;
    }

    const projectFile = paths.files.project.lists.roms.consoles[consoleName];

    if (!projectFile) {
      logger.fatal(
        `Project filepath for console ${consoleName} not found. Skipping this console when processing ROMs.`,
      );

      skipConsoles.push(consoleName);
      continue;
    }

    const writeListError = await writeConsoleRomsList(
      {
        deviceDir,
        projectFile,
      },
      fileIOExtras.fileIO.ls,
    );

    if (writeListError) {
      logger.warn(
        `Failed to write ROM list file for console ${consoleName}. Skipping this console when processing ROMs.`,
      );

      skipConsoles.push(consoleName);
    }
  }

  return [skipConsoles, undefined];
};

export default writeRomsLists;
