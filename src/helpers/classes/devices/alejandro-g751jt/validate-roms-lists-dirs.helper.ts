import validateProjectDirs, {
  type ValidateProjectDirsError,
} from "./validate-project-dirs.helper.js";
import validateDeviceDirs, {
  type ValidateDeviceDirsError,
} from "./validate-device-dirs.helper.js";
import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";

export type ValidateRomsListsDirsError =
  | ValidateProjectDirsError
  | ValidateDeviceDirsError;

const validateRomsListsDirs = async (
  paths: {
    project: string[];
    device: string[];
  },
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateRomsListsDirsError | undefined> => {
  const projectDirsValidationError = await validateProjectDirs(paths.project);

  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await validateDeviceDirs(
    paths.device,
    allDirsExist,
  );

  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateRomsListsDirs;
