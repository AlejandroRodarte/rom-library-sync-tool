import type { PathLike } from "node:fs";
import type { DirExistsAndIsReadableAndWritableError } from "./dir-exists-and-is-readable-and-writable.helper.js";
import dirExistsAndIsReadableAndWritable from "./dir-exists-and-is-readable-and-writable.helper.js";
import FsNotFoundError from "../../../classes/errors/fs-not-found-error.class.js";

export type AllDirsExistAndAreReadableAndWritableError =
  DirExistsAndIsReadableAndWritableError;

const allDirsExistAndAreReadableAndWritable = async (
  dirPaths: PathLike[],
): Promise<
  [boolean, undefined] | [undefined, AllDirsExistAndAreReadableAndWritableError]
> => {
  let allExist = true;

  for (const dirPath of dirPaths) {
    const existsError = await dirExistsAndIsReadableAndWritable(dirPath);

    if (!existsError) continue;

    if (existsError instanceof FsNotFoundError) {
      allExist = false;
      break;
    } else return [undefined, existsError];
  }

  return [allExist, undefined];
};

export default allDirsExistAndAreReadableAndWritable;
