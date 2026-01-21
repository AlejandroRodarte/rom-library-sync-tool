import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { DeviceName } from "../../../../types/device-name.type.js";
import validateRomsListsDirs from "./validate-roms-lists-dirs.helper.js";
import writeConsoleRomsList from "./write-console-roms-list.helper.js";

const writeRomsLists = async (
  name: DeviceName,
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
  fileIOExtras: FileIOExtras,
) => {
  await validateRomsListsDirs(name, paths, consoleNames, fileIOExtras);

  for (const consoleName of consoleNames) {
    logger.trace(
      `Beginning to write ROM list file for console ${consoleName}.`,
    );

    const deviceConsoleRomsDirPath =
      paths.dirs["content-targets"].roms.consoles[consoleName];

    if (!deviceConsoleRomsDirPath) {
      logger.fatal(
        `There is no ROM directory path for console ${consoleName} for device ${name}, even though we just checked it moments ago. Skipping this console.`,
      );
      return;
    }

    const deviceConsoleRomListFilePath =
      paths.files.project.lists.roms.consoles[consoleName];

    if (!deviceConsoleRomListFilePath) {
      logger.fatal(
        `(${name}) (${consoleName}): We failed to get ROM list filepath ${deviceConsoleRomListFilePath}, even though we just checked it moments ago. Skipping this console.`,
      );
      return;
    }

    logger.debug(
      `(${name}): ROM directory path for console ${consoleName} = ${deviceConsoleRomsDirPath}`,
    );

    await writeConsoleRomsList(
      {
        device: deviceConsoleRomsDirPath,
        project: deviceConsoleRomListFilePath,
      },
      fileIOExtras.fileIO.ls,
    );
  }
};

export default writeRomsLists;
