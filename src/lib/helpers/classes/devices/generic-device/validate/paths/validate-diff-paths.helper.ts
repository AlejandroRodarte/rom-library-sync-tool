import {
  READ,
  READ_WRITE,
} from "../../../../../../constants/rights/rights.constants.js";
import type { DiffPaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/diff-paths.interface.js";
import allProjectDirsExist, {
  type AllProjectDirsExistError,
} from "./all-project-dirs-exist.helper.js";
import allProjectFilesExist, {
  type AllProjectFilesExistError,
} from "./all-project-files-exist.helper.js";

export type ValidateDiffPathsError =
  | AllProjectDirsExistError
  | AllProjectFilesExistError;

const validateDiffPaths = async (
  paths: DiffPaths,
): Promise<ValidateDiffPathsError | undefined> => {
  const listDirsValidationError = await allProjectDirsExist(
    paths.project.list.dirs,
    READ,
  );
  if (listDirsValidationError) return listDirsValidationError;

  const listFilesValidationError = await allProjectFilesExist(
    paths.project.list.files,
    READ,
  );
  if (listFilesValidationError) return listFilesValidationError;

  const diffDirsValidationError = await allProjectDirsExist(
    paths.project.diff.dirs,
    READ_WRITE,
  );
  if (diffDirsValidationError) return diffDirsValidationError;
};

export default validateDiffPaths;
