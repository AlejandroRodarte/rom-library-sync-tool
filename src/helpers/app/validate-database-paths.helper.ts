import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import databasePaths from "../../objects/database-paths.object.js";
import type { AllDirsExistAndAreReadableError } from "../file-io/all-dirs-exist-and-are-readable.helper.js";
import type { AllFilesExistAndAreReadableError } from "../file-io/all-files-exist-and-are-readable.helper.js";
import fileIO from "../file-io/index.js";

export type ValidateDatabasePathsError =
  | AllDirsExistAndAreReadableError
  | AllFilesExistAndAreReadableError;

const validateDatabasePaths = async (): Promise<
  ValidateDatabasePathsError | undefined
> => {
  const dirs = databasePaths.allDirs;

  const [allDbDirsExist, allDbDirsExistError] =
    await fileIO.allDirsExistAndAreReadable(dirs);

  if (allDbDirsExistError) return allDbDirsExistError;
  if (!allDbDirsExist)
    return new FsNotFoundError(
      `Not all of the following directories exist and are readable.\n${dirs.join("\n")}\nPlease make sure all of them exist before running this script.`,
    );

  const files = databasePaths.allFiles;

  const [allDbFilesExist, allDbFilesExistError] =
    await fileIO.allFilesExistAndAreReadable(files);

  if (allDbFilesExistError) return allDbFilesExistError;
  if (!allDbFilesExist)
    return new FsNotFoundError(
      `Not all of the following files exist and are readable.\n${files.join("\n")}\nPlease make sure all of them exist before running this script.`,
    );
};

export default validateDatabasePaths;
