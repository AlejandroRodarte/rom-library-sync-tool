import { FILE } from "../../../constants/fs-types.constants.js";
import type { PathAccessItem } from "../../../interfaces/path-access-item.interface.js";
import type {
  AnyExistsError,
  AnyExistsTrueResult,
} from "./any-exists.helper.js";
import anyExists from "./any-exists.helper.js";

export type FileAccessItem = Omit<PathAccessItem, "type">;

export interface AnyFileExistsTrueResult {
  anyExists: true;
  fileAccessItem: FileAccessItem;
  error: AnyExistsTrueResult["error"];
}

export interface AnyFileExistsFalseResult {
  anyExists: false;
  fileAccessItem: undefined;
  error: undefined;
}

export type AnyFileExistsResult =
  | AnyFileExistsTrueResult
  | AnyFileExistsFalseResult;

export type AnyFileExistsError = AnyExistsError;

const anyFileExists = async (
  fileAccessItems: FileAccessItem[],
): Promise<
  [AnyFileExistsResult, undefined] | [undefined, AnyFileExistsError]
> => {
  const pathAccessItems: PathAccessItem[] = fileAccessItems.map((i) => ({
    type: FILE,
    ...i,
  }));

  const [anyExistsResult, anyExistsError] = await anyExists(pathAccessItems);

  if (anyExistsError) return [undefined, anyExistsError];

  if (anyExistsResult.anyExists) {
    const fileAccessItem: FileAccessItem = {
      path: anyExistsResult.pathAccessItem.path,
    };
    if (anyExistsResult.pathAccessItem.rights)
      fileAccessItem.rights = anyExistsResult.pathAccessItem.rights;

    return [
      { anyExists: true, fileAccessItem, error: anyExistsResult.error },
      undefined,
    ];
  }

  return [
    { anyExists: false, fileAccessItem: undefined, error: undefined },
    undefined,
  ];
};

export default anyFileExists;
