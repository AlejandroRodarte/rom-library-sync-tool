import FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTMediaListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-lists-dir-paths.interface.js";
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
  mediaDirPaths: AlejandroG751JTMediaListsDirPaths,
  mediaNamesDirPaths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateMediaListsDirsError | undefined> => {
  const projectDirsValidationError = await validateMediaListsProjectDirs(
    mediaDirPaths.project,
  );
  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await validateMediaListsDeviceDirs(
    [...mediaDirPaths.device.base, ...mediaNamesDirPaths],
    allDirsExist,
  );
  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateMediaListsDirs;
