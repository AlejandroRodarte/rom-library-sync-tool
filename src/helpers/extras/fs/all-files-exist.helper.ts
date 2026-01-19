import type { PathAccessItem } from "../../../interfaces/path-access-item.interface.js";
import allExist, {
  type AllExistError,
  type AllExistFalseResult,
} from "./all-exist.helper.js";

export type FileAccessItem = Omit<PathAccessItem, "type">;

export interface AllFilesExistTrueResult {
  allExist: true;
  fileAccessItem: undefined;
  error: undefined;
}

export interface AllFilesExistFalseResult {
  allExist: false;
  fileAccessItem: FileAccessItem;
  error: AllExistFalseResult["error"];
}

export type AllFilesExistResult =
  | AllFilesExistTrueResult
  | AllFilesExistFalseResult;

export type AllFilesExistError = AllExistError;

const allFilesExist = async (
  fileAccessItems: FileAccessItem[],
): Promise<
  [AllFilesExistResult, undefined] | [undefined, AllFilesExistError]
> => {
  const pathAccessItems: PathAccessItem[] = fileAccessItems.map((i) => ({
    type: "file",
    ...i,
  }));

  const [allExistResult, allExistError] = await allExist(pathAccessItems);

  if (allExistError) return [undefined, allExistError];

  if (!allExistResult.allExist) {
    const fileAccessItem: FileAccessItem = {
      path: allExistResult.pathAccessItem.path,
    };
    if (allExistResult.pathAccessItem.rights)
      fileAccessItem.rights = allExistResult.pathAccessItem.rights;

    return [
      { allExist: false, fileAccessItem, error: allExistResult.error },
      undefined,
    ];
  }

  return [
    { allExist: true, fileAccessItem: undefined, error: undefined },
    undefined,
  ];
};

export default allFilesExist;
