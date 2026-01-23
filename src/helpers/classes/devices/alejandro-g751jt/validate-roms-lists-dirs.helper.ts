import validateRomsListsProjectDirs, {
  type ValidateRomsListsProjectDirsError,
} from "./validate-roms-lists-project-dirs.helper.js";
import validateRomsListsDeviceDirs, {
  type ValidateRomsListsDeviceDirsError,
} from "./validate-roms-lists-device-dirs.helper.js";
import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";

export type ValidateRomsListsDirsError =
  | ValidateRomsListsProjectDirsError
  | ValidateRomsListsDeviceDirsError;

const validateRomsListsDirs = async (
  paths: {
    project: string[];
    device: string[];
  },
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateRomsListsDirsError | undefined> => {
  const projectDirsValidationError = await validateRomsListsProjectDirs(
    paths.project,
  );

  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await validateRomsListsDeviceDirs(
    paths.device,
    allDirsExist,
  );

  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateRomsListsDirs;
