import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import fileExistsAndIsReadable, {
  type FileExistsAndIsReadableError,
} from "./file-exists-and-is-readable.helper.js";

export type AllFilesExistAndAreReadableError = FileExistsAndIsReadableError;

const allFilesExistAndAreReadable = async (
  filePaths: string[],
): Promise<
  [boolean, undefined] | [undefined, AllFilesExistAndAreReadableError]
> => {
  let allFilesExist = true;

  for (const filePath of filePaths) {
    const existsError = await fileExistsAndIsReadable(filePath);

    if (existsError) {
      if (existsError instanceof FsNotFoundError) {
        allFilesExist = false;
        break;
      } else return [undefined, existsError];
    }
  }

  return [allFilesExist, undefined];
};

export default allFilesExistAndAreReadable;
