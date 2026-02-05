import type { PathAccessItem } from "../../../interfaces/paths/path-access-item.interface.js";
import exists, {
  type ExistsError,
  type ExistsFalseResult,
  type ExistsTrueResult,
} from "./exists.helper.js";

export interface AllExistTrueResult {
  allExist: true;
  pathAccessItem: undefined;
  error: ExistsTrueResult["error"];
}

export interface AllExistFalseResult {
  allExist: false;
  pathAccessItem: PathAccessItem;
  error: ExistsFalseResult["error"];
}

export type AllExistResult = AllExistTrueResult | AllExistFalseResult;

export type AllExistError = ExistsError;

const allExist = async (
  pathAccessItems: PathAccessItem[],
): Promise<[AllExistResult, undefined] | [undefined, AllExistError]> => {
  for (const pathAccessItem of pathAccessItems) {
    const [pathExists, existsError] = await exists(
      pathAccessItem.type,
      pathAccessItem.path,
      pathAccessItem.rights,
    );

    if (existsError) return [undefined, existsError];
    if (!pathExists.exists)
      return [
        { allExist: false, pathAccessItem, error: pathExists.error },
        undefined,
      ];
  }

  return [
    { allExist: true, pathAccessItem: undefined, error: undefined },
    undefined,
  ];
};

export default allExist;
