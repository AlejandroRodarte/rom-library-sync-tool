import { DIR } from "../../../constants/fs/fs-types.constants.js";
import type { RightsForValidation } from "../../../types/rights/rights-for-validation.type.js";
import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type DirExistsResult = ExistsResult;
export type DirExistsError = ExistsError;

const dirExists = async (
  dirPath: string,
  rights?: RightsForValidation,
): Promise<[DirExistsResult, undefined] | [undefined, DirExistsError]> => {
  const [dirExists, existsError] = await exists(DIR, dirPath, rights);

  if (existsError) return [undefined, existsError];
  return [dirExists, undefined];
};

export default dirExists;
