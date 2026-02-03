import anyFileExists, {
  type AnyFileExistsError,
  type AnyFileExistsTrueResult,
  type FileAccessItem,
} from "../../../extras/fs/any-file-exists.helper.js";

const fsExtras = {
  anyFileExists,
};

export type AnyProjectFileExists =
  | AnyFileExistsError
  | AnyFileExistsTrueResult["error"];

const anyProjectFileExists = async (
  paths: string[],
  rights: "r" | "w" | "rw" = "r",
): Promise<AnyProjectFileExists | undefined> => {
  const projectDirAccessItems: FileAccessItem[] = paths.map((p) => ({
    path: p,
    rights,
  }));

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.anyFileExists(projectDirAccessItems);

  if (allProjectDirsExistError) return allProjectDirsExistError;

  if (allProjectDirsExistResult.anyExists)
    return allProjectDirsExistResult.error;
};

export default anyProjectFileExists;
