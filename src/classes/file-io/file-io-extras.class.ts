import type { FileIO } from "../../interfaces/file-io.interface.js";
import type { PathAccessItem } from "../../interfaces/path-access-item.interface.js";
import type CustomError from "../errors/custom-error.abstract.class.js";
import FileIOBadPathError from "../errors/file-io-bad-path.class.js";
import FileIOBadTypeError from "../errors/file-io-bad-type-error.class.js";
import FileIONotFoundError from "../errors/file-io-not-found-error.class.js";

class FileIOExtras {
  private _fileIO: FileIO;

  constructor(fileIO: FileIO) {
    this._fileIO = fileIO;
  }

  allExist: (
    pathAccessList: PathAccessItem[],
  ) => Promise<[boolean, undefined] | [undefined, CustomError]> = async (
    pathAccessList,
  ) => {
    let allItemsAreValid = true;

    for (const pathAccessItem of pathAccessList) {
      const { path, type, rights } = pathAccessItem;
      const existsError = await this._fileIO.exists(type, path, rights);

      if (existsError)
        if (
          existsError instanceof FileIOBadPathError ||
          existsError instanceof FileIOBadTypeError ||
          existsError instanceof FileIONotFoundError
        ) {
          allItemsAreValid = false;
          break;
        } else return [undefined, existsError];
    }

    return [allItemsAreValid, undefined];
  };
}

export default FileIOExtras;
