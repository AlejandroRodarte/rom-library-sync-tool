import FileIOExtras, {
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import getRomsListsDeviceDirs from "./get-roms-lists-device-dirs.helper.js";

const validateRomsListsDeviceDirs = async (
  paths: AlejandroG751JTPaths["dirs"]["content-targets"]["roms"],
  consoleNames: ConsoleName[],
  allDirsExist: FileIOExtras["allDirsExist"],
) => {
  const deviceDirs = getRomsListsDeviceDirs(paths, consoleNames);
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

export default validateRomsListsDeviceDirs;
