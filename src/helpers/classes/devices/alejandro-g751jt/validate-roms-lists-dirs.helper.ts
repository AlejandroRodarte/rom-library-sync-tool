import FileIOExtras, {
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";
import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";

import logger from "../../../../objects/logger.object.js";
import getRomsListsProjectDirs from "./get-roms-lists-project-dirs.helper.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import getRomsListsDeviceDirs from "./get-roms-lists-device-dirs.helper.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { DeviceName } from "../../../../types/device-name.type.js";

const fsExtras = {
  allDirsExist,
};

const validateRomsListsDirs = async (
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
};

export default validateRomsListsDirs;
