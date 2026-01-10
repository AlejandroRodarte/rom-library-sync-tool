import type { PathLike } from "node:fs";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import dirExistsAndIsReadable, {
  type DirExistsAndIsReadableError,
} from "./dir-exists-and-is-readable.helper.js";

export type AllDirsExistAndAreReadableError = DirExistsAndIsReadableError;

const allDirsExistAndAreReadable = async (
  dirPaths: PathLike[],
): Promise<
  [boolean, undefined] | [undefined, AllDirsExistAndAreReadableError]
> => {
  let allExist = true;

  for (const dirPath of dirPaths) {
    const existsError = await dirExistsAndIsReadable(dirPath);

    if (!existsError) continue;

    if (existsError instanceof FsNotFoundError) {
      allExist = false;
      break;
    } else return [undefined, existsError];
  }

  return [allExist, undefined];
};

export default allDirsExistAndAreReadable;
