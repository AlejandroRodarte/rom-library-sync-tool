import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import { type DirAccessItem as FileIODirAccessItem } from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { DeviceName } from "../../../../types/device-name.type.js";
import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";
import getRomsListsDeviceDirs from "./get-roms-lists-device-dirs.helper.js";
import getRomsListsProjectDirs from "./get-roms-lists-project-dirs.helper.js";

const fsExtras = {
  allDirsExist,
  openFileForWriting,
  writeLines,
};

const writeRomsLists = async (
  name: DeviceName,
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
  fileIOExtras: FileIOExtras,
) => {
  logger.info(
    `ROMs content target selected for device ${name}. Fetching project and device directories to validate before doing anything else...`,
  );

  const projectDirs = getRomsListsProjectDirs(paths);
  logger.debug(`Project directories to validate:`, ...projectDirs);

  const projectDirAccessItems: FsDirAccessItem[] = projectDirs.map((p) => ({
    path: p,
    rights: "rw",
  }));

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allDirsExist(projectDirAccessItems);

  if (allProjectDirsExistError) {
    logger.warn(
      `${allProjectDirsExistError.toString()}. Will not list anything until all project directory paths are ready.`,
    );
    // TODO: require device.write.lists() to return something that informs that the `list` operation completely failed.
    return;
  }

  if (!allProjectDirsExistResult.allExist) {
    logger.warn(
      `${allProjectDirsExistResult.error.toString()}. Will not list anything until all project directory paths are ready.`,
    );
    // TODO: require device.write.lists() to return something that informs that the `list` operation completely failed.
    return;
  }

  logger.info(
    `All ROM lists directories for device ${name} are valid. Continuing with the device directories.`,
  );

  const deviceDirs = getRomsListsDeviceDirs(paths, consoleNames);
  logger.debug(`Device directories to validate:`, ...deviceDirs);

  const deviceDirAccessItems: FileIODirAccessItem[] = deviceDirs.map((p) => ({
    path: p,
    rights: "r",
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await fileIOExtras.allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) {
    logger.warn(
      `${allDeviceDirsExistError.toString()}. Will not list anything until all project directory paths are ready.`,
    );
    // TODO: require device.write.lists() to return something that informs that the `list` operation completely failed.
    return;
  }

  if (!allDeviceDirsExistResult.allExist) {
    logger.warn(
      `${allDeviceDirsExistResult.error.toString()}. Will not list anything until all project directory paths are ready.`,
    );
    // TODO: require device.write.lists() to return something that informs that the `list` operation completely failed.
    return;
  }

  logger.info(
    `Device directories for ${name} are valid. Proceeding to fetch lists.`,
  );

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
      continue;
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
      continue;
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
      continue;
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
      continue;
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
  }
};

export default writeRomsLists;
