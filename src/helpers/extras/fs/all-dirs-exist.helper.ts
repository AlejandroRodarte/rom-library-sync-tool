import type { PathAccessItem } from "../../../interfaces/path-access-item.interface.js";
import allExist, {
  type AllExistError,
  type AllExistFalseResult,
} from "./all-exist.helper.js";

export type DirAccessItem = Omit<PathAccessItem, "type">;

export interface AllDirsExistTrueResult {
  allExist: true;
  dirAccessItem: undefined;
  error: undefined;
}

export interface AllDirsExistFalseResult {
  allExist: false;
  dirAccessItem: DirAccessItem;
  error: AllExistFalseResult["error"];
}

export type AllDirsExistResult =
  | AllDirsExistTrueResult
  | AllDirsExistFalseResult;

export type AllDirsExistError = AllExistError;

const allDirsExist = async (
  dirAccessItems: DirAccessItem[],
): Promise<
  [AllDirsExistResult, undefined] | [undefined, AllDirsExistError]
> => {
  const pathAccessItems: PathAccessItem[] = dirAccessItems.map((i) => ({
    type: "dir",
    ...i,
  }));

  const [allExistResult, allExistError] = await allExist(pathAccessItems);
  if (allExistError) return [undefined, allExistError];

  if (!allExistResult.allExist) {
    const dirAccessItem: DirAccessItem = {
      path: allExistResult.pathAccessItem.path,
    };
    if (allExistResult.pathAccessItem.rights)
      dirAccessItem.rights = allExistResult.pathAccessItem.rights;

    return [
      { allExist: false, dirAccessItem, error: allExistResult.error },
      undefined,
    ];
  }

  return [
    { allExist: true, dirAccessItem: undefined, error: undefined },
    undefined,
  ];
};

export default allDirsExist;
