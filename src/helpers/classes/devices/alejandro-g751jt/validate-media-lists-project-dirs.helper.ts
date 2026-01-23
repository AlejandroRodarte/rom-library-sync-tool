import allDirsExist, {
  type AllDirsExistError,
  type AllDirsExistFalseResult,
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";

const fsExtras = {
  allDirsExist,
};

export type ValidateMediaListsProjectDirsError =
  | AllDirsExistError
  | AllDirsExistFalseResult["error"];

const validateMediaListsProjectDirs = async (
  dirPaths: string[],
): Promise<ValidateMediaListsProjectDirsError | undefined> => {
  const projectDirAccessItems: FsDirAccessItem[] = dirPaths.map((p) => ({
    type: "dir",
    path: p,
    rights: "rw",
  }));

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allDirsExist(projectDirAccessItems);

  if (allProjectDirsExistError) return allProjectDirsExistError;
  if (!allProjectDirsExistResult.allExist)
    return allProjectDirsExistResult.error;
};

export default validateMediaListsProjectDirs;
