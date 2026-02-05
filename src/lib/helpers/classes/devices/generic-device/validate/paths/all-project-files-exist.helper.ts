import { READ } from "../../../../../../constants/rights/rights.constants.js";
import type { RightsForValidation } from "../../../../../../types/rights/rights-for-validation.type.js";
import allFilesExist, {
  type AllFilesExistError,
  type AllFilesExistFalseResult,
  type FileAccessItem,
} from "../../../../../extras/fs/all-files-exist.helper.js";

const fsExtras = {
  allFilesExist,
};

export type AllProjectFilesExistError =
  | AllFilesExistError
  | AllFilesExistFalseResult["error"];

const allProjectFilesExist = async (
  paths: string[],
  rights: RightsForValidation = READ,
): Promise<AllProjectFilesExistError | undefined> => {
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

export default allProjectFilesExist;
