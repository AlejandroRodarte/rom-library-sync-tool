import type {
  ExistsMethodError,
  ExistsMethodFalseResult,
  FileIO,
} from "../../interfaces/file-io.interface.js";
import type { PathAccessItem } from "../../interfaces/path-access-item.interface.js";

export type DirAccessItem = Omit<PathAccessItem, "type">;

export interface AllExistMethodFalseResult {
  allExist: false;
  pathAccessItem: PathAccessItem;
  error: ExistsMethodFalseResult["error"];
}

export interface AllDirsExistMethodFalseResult {
  allExist: false;
  dirAccessItem: DirAccessItem;
  error: AllExistMethodFalseResult["error"];
}

export interface AllExistMethodTrueResult {
  allExist: true;
  pathAccessItem: undefined;
  error: undefined;
}

export interface AllDirsExistMethodTrueResult {
  allExist: true;
  dirAccessItem: undefined;
  error: undefined;
}

export type AllExistMethodResult =
  | AllExistMethodTrueResult
  | AllExistMethodFalseResult;

export type AllDirsExistMethodResult =
  | AllDirsExistMethodFalseResult
  | AllDirsExistMethodTrueResult;

export type AllExistMethodError = ExistsMethodError;
export type AllDirsExistMethodError = AllExistMethodError;

class FileIOExtras {
  private _fileIO: FileIO;

  constructor(fileIO: FileIO) {
    this._fileIO = fileIO;
  }

  get fileIO(): FileIO {
    return this._fileIO;
  }

  allExist: (
    pathAccessList: PathAccessItem[],
  ) => Promise<
    [AllExistMethodResult, undefined] | [undefined, AllExistMethodError]
  > = async (pathAccessList) => {
    for (const pathAccessItem of pathAccessList) {
      const [existsResult, existsError] = await this._fileIO.exists(
        pathAccessItem.type,
        pathAccessItem.path,
        pathAccessItem.rights,
      );

      if (existsError) return [undefined, existsError];

      if (!existsResult.exists)
        return [
          { allExist: false, pathAccessItem, error: existsResult.error },
          undefined,
        ];
    }

    return [
      { allExist: true, pathAccessItem: undefined, error: undefined },
      undefined,
    ];
  };

  allDirsExist: (
    dirAccessList: DirAccessItem[],
  ) => Promise<
    [AllDirsExistMethodResult, undefined] | [undefined, AllDirsExistMethodError]
  > = async (dirAccessList) => {
    const pathAccessList: PathAccessItem[] = dirAccessList.map((d) => ({
      type: "dir",
      ...d,
    }));

    const [allExistResult, allExistError] = await this.allExist(pathAccessList);

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
}

export default FileIOExtras;
