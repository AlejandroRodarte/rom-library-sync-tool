import FileIOExistsError from "../../../classes/errors/file-io-exists-error.class.js";
import type { PathAccessItem } from "../../../interfaces/paths/path-access-item.interface.js";
import type { ExistsError } from "./exists.helper.js";
import exists from "./exists.helper.js";

export interface AnyExistsFalseResult {
  anyExists: false;
  pathAccessItem: undefined;
  error: undefined;
}

export interface AnyExistsTrueResult {
  anyExists: true;
  pathAccessItem: PathAccessItem;
  error: FileIOExistsError;
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
      return [
        {
          anyExists: true,
          pathAccessItem,
          error: new FileIOExistsError(
            `Path ${pathAccessItem.path} exists, when it should NOT exist.`,
          ),
        },
        undefined,
      ];
  }

  return [
    { anyExists: false, pathAccessItem: undefined, error: undefined },
    undefined,
  ];
};

export default anyExists;
