import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import validateRomsListsProjectDirs from "./validate-roms-lists-project-dirs.helper.js";
import validateRomsListsDeviceDirs from "./validate-roms-lists-device-dirs.helper.js";
import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";

const validateRomsListsDirs = async (
  paths: AlejandroG751JTPaths["dirs"],
  consoleNames: ConsoleName[],
  allDirsExist: FileIOExtras["allDirsExist"],
) => {
  await validateRomsListsProjectDirs(
    paths.project.lists["content-targets"].roms,
  );

  await validateRomsListsDeviceDirs(
    paths["content-targets"].roms,
    consoleNames,
    allDirsExist,
  );
};

export default validateRomsListsDirs;
