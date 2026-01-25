import type { DiffPaths } from "../../../../interfaces/diff-paths.interface.js";
import validateProjectDirs, {
  type ValidateProjectDirsError,
} from "./validate-project-dirs.helper.js";
import validateProjectFiles, {
  type ValidateProjectFilesError,
} from "./validate-project-files.helper.js";

export type ValidateDiffPathsError =
  | ValidateProjectDirsError
  | ValidateProjectFilesError;

const validateDiffPaths = async (
  paths: DiffPaths,
): Promise<ValidateDiffPathsError | undefined> => {
  const listDirsValidationError = await validateProjectDirs(
    paths.project.list.dirs,
    "r",
  );
  if (listDirsValidationError) return listDirsValidationError;

  const listFilesValidationError = await validateProjectFiles(
    paths.project.list.files,
    "r",
  );
  if (listFilesValidationError) return listFilesValidationError;

  const diffDirsValidationError = await validateProjectDirs(
    paths.project.diff.dirs,
    "rw",
  );
  if (diffDirsValidationError) return diffDirsValidationError;
};

export default validateDiffPaths;
