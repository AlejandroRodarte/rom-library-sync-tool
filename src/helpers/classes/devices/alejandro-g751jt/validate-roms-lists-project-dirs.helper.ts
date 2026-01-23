import allDirsExist, {
  type AllDirsExistError,
  type AllDirsExistFalseResult,
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";

const fsExtras = {
  allDirsExist,
};

export type ValidateRomsListsProjectDirsError =
  | AllDirsExistError
  | AllDirsExistFalseResult["error"];

const validateRomsListsProjectDirs = async (
  paths: string[],
): Promise<ValidateRomsListsProjectDirsError | undefined> => {
  const projectDirAccessItems: FsDirAccessItem[] = paths.map((p) => ({
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
