import type { PathAccessItem } from "../../../interfaces/path-access-item.interface.js";
import type { ExistsError } from "./exists.helper.js";
import exists from "./exists.helper.js";

export interface AnyExistsFalseResult {
  anyExists: false;
  pathAccessItem: undefined;
}

export interface AnyExistsTrueResult {
  anyExists: true;
  pathAccessItem: PathAccessItem;
}

export type AnyExistsResult = AnyExistsFalseResult | AnyExistsTrueResult;
export type AnyExistsError = ExistsError;

const anyExists = async (
  pathAccessItems: PathAccessItem[],
): Promise<[AnyExistsResult, undefined] | [undefined, AnyExistsError]> => {
  for (const pathAccessItem of pathAccessItems) {
    const [pathExists, existsError] = await exists(
      pathAccessItem.type,
      pathAccessItem.path,
      pathAccessItem.rights,
    );

    if (existsError) return [undefined, existsError];
    if (pathExists.exists)
      return [{ anyExists: true, pathAccessItem }, undefined];
  }

  return [{ anyExists: false, pathAccessItem: undefined }, undefined];
};

export default anyExists;
