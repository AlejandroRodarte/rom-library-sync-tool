import allDirsExist, {
  type AllDirsExistError,
  type AllDirsExistFalseResult,
  type DirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";

const fsExtras = {
  allDirsExist,
};

export type AllProjectDirsExistError =
  | AllDirsExistError
  | AllDirsExistFalseResult["error"];

const allProjectDirsExist = async (
  paths: string[],
  rights: "r" | "w" | "rw" = "rw",
): Promise<AllProjectDirsExistError | undefined> => {
  const projectDirAccessItems: DirAccessItem[] = paths.map((p) => ({
    path: p,
    rights,
  }));

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allDirsExist(projectDirAccessItems);

  if (allProjectDirsExistError) return allProjectDirsExistError;

  if (!allProjectDirsExistResult.allExist)
    return allProjectDirsExistResult.error;
};

export default allProjectDirsExist;
