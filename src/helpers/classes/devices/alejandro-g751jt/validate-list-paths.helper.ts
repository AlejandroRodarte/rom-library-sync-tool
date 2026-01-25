import FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";
import validateDeviceDirs, {
  type ValidateDeviceDirsError,
} from "./validate-device-dirs.helper.js";
import validateProjectDirs, {
  type ValidateProjectDirsError,
} from "./validate-project-dirs.helper.js";

export type ValidateListPathsError =
  | ValidateProjectDirsError
  | ValidateDeviceDirsError;

const validateListPaths = async (
  paths: ListPaths,
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateListPathsError | undefined> => {
  const projectDirsValidationError = await validateProjectDirs(
    paths.project.dirs,
    "rw",
  );
  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await validateDeviceDirs(
    paths.device.dirs,
    allDirsExist,
    "r",
  );
  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateListPaths;
