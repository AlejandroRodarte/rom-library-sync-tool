import { LINK } from "../../../constants/fs/fs-types.constants.js";
import type { RightsForValidation } from "../../../types/rights/rights-for-validation.type.js";
import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type SymlinkExistsResult = ExistsResult;
export type SymlinkExistsError = ExistsError;

const symlinkExists = async (
  symlinkPath: string,
  rights?: RightsForValidation,
): Promise<
  [SymlinkExistsResult, undefined] | [undefined, SymlinkExistsError]
> => {
  const [symlinkExists, existsError] = await exists(LINK, symlinkPath, rights);

  if (existsError) return [undefined, existsError];
  return [symlinkExists, undefined];
};

export default symlinkExists;
