import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { SyncPaths } from "../../../../interfaces/sync-paths.interface.js";
import allDeviceDirsExist, {
  type AllDeviceDirsExistError,
} from "./all-device-dirs-exist.helper.js";
import allProjectDirsExist, {
  type AllProjectDirsExistError,
} from "./all-project-dirs-exist.helper.js";
import allProjectFilesExist, {
  type AllProjectFilesExistError,
} from "./all-project-files-exist.helper.js";
import anyProjectFileExists, {
  type AnyProjectFileExists,
} from "./any-project-file-exists.helper.js";

export type ValidateSyncPathsError =
  | AllProjectDirsExistError
  | AllProjectFilesExistError
  | AnyProjectFileExists
  | AllDeviceDirsExistError;

const validateSyncPaths = async (
  paths: SyncPaths,
  fileIOExtras: FileIOExtras,
): Promise<ValidateSyncPathsError | undefined> => {
  const projectDiffDirsValidationError = await allProjectDirsExist(
    paths.project.diff.dirs,
    "r",
  );
  if (projectDiffDirsValidationError) return projectDiffDirsValidationError;

  const projectDiffFilesValidationError = await allProjectFilesExist(
    paths.project.diff.files,
    "r",
  );
  if (projectDiffFilesValidationError) return projectDiffFilesValidationError;

  const projectFailedDirsValidationError = await allProjectDirsExist(
    paths.project.failed.dirs,
    "rw",
  );
  if (projectFailedDirsValidationError) return projectFailedDirsValidationError;

  const projectFailedFilesValidationError = await anyProjectFileExists(
    paths.project.failed.files,
    "r",
  );
  if (projectFailedFilesValidationError)
    return projectFailedFilesValidationError;

  const deviceDirsValidationError = await allDeviceDirsExist(
    paths.device.dirs,
    fileIOExtras.allDirsExist,
    "rw",
  );
  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateSyncPaths;
