import allFilesExist, {
  type AllFilesExistError,
  type AllFilesExistFalseResult,
  type FileAccessItem,
} from "../../../extras/fs/all-files-exist.helper.js";

const fsExtras = {
  allFilesExist,
};

export type ValidateProjectFilesError =
  | AllFilesExistError
  | AllFilesExistFalseResult["error"];

const validateProjectFiles = async (
  paths: string[],
  rights: "r" | "w" | "rw" = "r",
): Promise<ValidateProjectFilesError | undefined> => {
  const projectDirAccessItems: FileAccessItem[] = paths.map((p) => ({
    path: p,
    rights,
  }));

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allFilesExist(projectDirAccessItems);

  if (allProjectDirsExistError) return allProjectDirsExistError;

  if (!allProjectDirsExistResult.allExist)
    return allProjectDirsExistResult.error;
};

export default validateProjectFiles;
