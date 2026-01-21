import FileIOExtras, {
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";
import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";

import getRomsListsProjectDirs from "./get-roms-lists-project-dirs.helper.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import getRomsListsDeviceDirs from "./get-roms-lists-device-dirs.helper.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";

const fsExtras = {
  allDirsExist,
};

const validateRomsListsDirs = async (
  paths: AlejandroG751JTPaths["dirs"],
  consoleNames: ConsoleName[],
  allDirsExist: FileIOExtras["allDirsExist"],
) => {
  const projectDirs = getRomsListsProjectDirs(paths.project.lists);
  const projectDirAccessItems: FsDirAccessItem[] = projectDirs.map((p) => ({
    path: p,
    rights: "rw",
  }));

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allDirsExist(projectDirAccessItems);

  if (allProjectDirsExistError) {
    return;
  }

  if (!allProjectDirsExistResult.allExist) {
    return;
  }

  const deviceDirs = getRomsListsDeviceDirs(
    paths["content-targets"],
    consoleNames,
  );
  const deviceDirAccessItems: FileIODirAccessItem[] = deviceDirs.map((p) => ({
    path: p,
    rights: "r",
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) {
    return;
  }

  if (!allDeviceDirsExistResult.allExist) {
    return;
  }
};

export default validateRomsListsDirs;
