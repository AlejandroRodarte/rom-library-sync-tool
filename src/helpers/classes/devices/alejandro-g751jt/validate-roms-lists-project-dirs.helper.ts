import allDirsExist, {
  type AllDirsExistError,
  type AllDirsExistFalseResult,
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import getRomsListsProjectDirs from "./get-roms-lists-project-dirs.helper.js";

const fsExtras = {
  allDirsExist,
};

export type ValidateRomsListsProjectDirsError =
  | AllDirsExistError
  | AllDirsExistFalseResult["error"];

const validateRomsListsProjectDirs = async (
  paths: AlejandroG751JTPaths["dirs"]["project"]["lists"]["content-targets"]["roms"],
): Promise<ValidateRomsListsProjectDirsError | undefined> => {
  const projectDirs = getRomsListsProjectDirs(paths);
  const projectDirAccessItems: FsDirAccessItem[] = projectDirs.map((p) => ({
    path: p,
    rights: "rw",
  }));

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allDirsExist(projectDirAccessItems);

  if (allProjectDirsExistError) return allProjectDirsExistError;

  if (!allProjectDirsExistResult.allExist)
    return allProjectDirsExistResult.error;
};

export default validateRomsListsProjectDirs;
