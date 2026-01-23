import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";
import FileIOExtras, {
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTMediaListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-lists-dir-paths.interface.js";
import validateMediaListsProjectDirs from "./validate-media-lists-project-dirs.helper.js";
import validateMediaListsDeviceDirs from "./validate-media-lists-device-dirs.helper.js";

const fsExtras = {
  allDirsExist,
};

const validateMediaListsDirs = async (
  mediaDirPaths: AlejandroG751JTMediaListsDirPaths,
  mediaNamesDirPaths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
) => {
  await validateMediaListsProjectDirs(mediaDirPaths.project);

  await validateMediaListsDeviceDirs(
    [...mediaDirPaths.device.base, ...mediaNamesDirPaths],
    allDirsExist,
  );
};

export default validateMediaListsDirs;
