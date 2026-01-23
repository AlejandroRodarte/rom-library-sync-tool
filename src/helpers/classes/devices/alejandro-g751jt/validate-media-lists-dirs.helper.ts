import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";

import FileIOExtras, {
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTMediaListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-lists-dir-paths.interface.js";

const fsExtras = {
  allDirsExist,
};

const validateMediaListsDirs = async (
  mediaDirPaths: AlejandroG751JTMediaListsDirPaths,
  mediaNamesDirPaths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
) => {
  const projectDirAccessItems: FsDirAccessItem[] = mediaDirPaths.project.map(
    (p) => ({
      type: "dir",
      path: p,
      rights: "rw",
    }),
  );

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allDirsExist(projectDirAccessItems);

  if (allProjectDirsExistError) return allProjectDirsExistError;
  if (!allProjectDirsExistResult.allExist)
    return allProjectDirsExistResult.error;

  const deviceDirAccessItems: FileIODirAccessItem[] = [
    ...mediaDirPaths.device.base,
    ...mediaNamesDirPaths,
  ].map((p) => ({
    type: "dir",
    path: p,
    rights: "r",
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) return allProjectDirsExistError;
  if (!allDeviceDirsExistResult.allExist)
    return allProjectDirsExistResult.error;
};

export default validateMediaListsDirs;
