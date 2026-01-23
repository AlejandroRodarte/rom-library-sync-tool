import FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import validateMediaListsProjectDirs, {
  type ValidateMediaListsProjectDirsError,
} from "./validate-media-lists-project-dirs.helper.js";
import validateMediaListsDeviceDirs, {
  type ValidateMediaListsDeviceDirsError,
} from "./validate-media-lists-device-dirs.helper.js";

export type ValidateMediaListsDirsError =
  | ValidateMediaListsProjectDirsError
  | ValidateMediaListsDeviceDirsError;

const validateMediaListsDirs = async (
  paths: {
    project: string[];
    device: string[];
  },
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateMediaListsDirsError | undefined> => {
  const projectDirsValidationError = await validateMediaListsProjectDirs(
    paths.project,
  );
  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await validateMediaListsDeviceDirs(
    paths.device,
    allDirsExist,
  );
  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateMediaListsDirs;
