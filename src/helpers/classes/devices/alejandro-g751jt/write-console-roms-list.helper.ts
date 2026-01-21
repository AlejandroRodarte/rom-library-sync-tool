import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { DeviceName } from "../../../../types/device-name.type.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";

const writeConsoleRomsList = async (
  name: DeviceName,
  consoleName: ConsoleName,
  paths: AlejandroG751JTPaths,
  fileIOExtras: FileIOExtras,
) => {
  logger.trace(`Beginning to write ROM list file for console ${consoleName}.`);

  const deviceConsoleRomsDirPath =
    paths.dirs["content-targets"].roms.consoles[consoleName];

  if (!deviceConsoleRomsDirPath) {
    logger.fatal(
      `There is no ROM directory path for console ${consoleName} for device ${name}, even though we just checked it moments ago. Skipping this console.`,
    );
    return;
  }

  logger.debug(
    `(${name}): ROM directory path for console ${consoleName} = ${deviceConsoleRomsDirPath}`,
  );

  logger.trace(
    `(${name}) (${consoleName}): About to attempt to fetch entries from directory at ${deviceConsoleRomsDirPath}`,
  );

  const [lsEntries, lsError] = await fileIOExtras.fileIO.ls(
    deviceConsoleRomsDirPath,
  );

  if (lsError) {
    logger.error(`${lsError.toString()}`, "Skipping this console.");
    return;
  }

  logger.info(
    `(${name}) (${consoleName}) Successfully fetched entries from directory ${deviceConsoleRomsDirPath}`,
  );

  const filenames = lsEntries
    .map((e) => e.name)
    .filter((n) => n !== "systeminfo.txt" && n !== "metadata.txt");

  const deviceConsoleRomListFilePath =
    paths.files.project.lists.roms.consoles[consoleName];

  if (!deviceConsoleRomListFilePath) {
    logger.fatal(
      `(${name}) (${consoleName}): We failed to get ROM list filepath ${deviceConsoleRomListFilePath}, even though we just checked it moments ago. Skipping this console.`,
    );
    return;
  }

  logger.info(
    `(${name}) (${consoleName}): Opening (and overwriting, if needed) list filepath at ${deviceConsoleRomListFilePath}`,
  );

  const [listFileHandle, listFileError] = await openFileForWriting(
    deviceConsoleRomListFilePath,
    { overwrite: true },
  );

  if (listFileError) {
    logger.error(
      `(${name}) (${consoleName}): ${listFileError.toString()}`,
      "Skipping this console.",
    );
    return;
  }

  logger.trace(
    `(${name}) (${consoleName}): About to write list lines to file at ${deviceConsoleRomListFilePath}`,
  );

  const writeLinesError = await writeLines(listFileHandle, filenames);

  if (writeLinesError) {
    await listFileHandle.close();
    logger.error(
      `(${name}) (${consoleName}): ${writeLinesError.toString()}`,
      "Skipping this console.",
    );
  }

  logger.info(
    `(${name}) (${consoleName}): Succesfully wrote list lines to file at ${deviceConsoleRomListFilePath}.`,
  );
};

export default writeConsoleRomsList;
