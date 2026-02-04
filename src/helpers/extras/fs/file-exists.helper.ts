import { FILE } from "../../../constants/fs-types.constants.js";
import type { RightsForValidation } from "../../../types/rights-for-validation.type.js";
import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type FileExistsResult = ExistsResult;
export type FileExistsError = ExistsError;

const fileExists = async (
  filePath: string,
  rights?: RightsForValidation,
): Promise<[FileExistsResult, undefined] | [undefined, FileExistsError]> => {
  const [fileExists, existsError] = await exists(FILE, filePath, rights);

  if (existsError) return [undefined, existsError];
  return [fileExists, undefined];
};

export default fileExists;
