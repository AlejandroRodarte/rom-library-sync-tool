import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import getRomsListsProjectDirs from "./get-roms-lists-project-dirs.helper.js";

const fsExtras = {
  allDirsExist,
};

const validateRomsListsProjectDirs = async (
  paths: AlejandroG751JTPaths["dirs"]["project"]["lists"]["content-targets"]["roms"],
) => {
  const projectDirs = getRomsListsProjectDirs(paths);
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
};

export default validateRomsListsProjectDirs;
