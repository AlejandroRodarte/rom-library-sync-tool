import { READ_WRITE } from "../../../../constants/rights.constants.js";
import type { RightsForValidation } from "../../../../types/rights-for-validation.type.js";
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
  rights: RightsForValidation = READ_WRITE,
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
