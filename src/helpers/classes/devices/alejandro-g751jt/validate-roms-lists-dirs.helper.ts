import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
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
  paths: AlejandroG751JTPaths["dirs"],
  consoleNames: ConsoleName[],
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateRomsListsDirsError | undefined> => {
  const projectDirsValidationError = await validateRomsListsProjectDirs(
    paths.project.lists["content-targets"].roms,
  );

  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await validateRomsListsDeviceDirs(
    paths["content-targets"].roms,
    consoleNames,
    allDirsExist,
  );

  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateRomsListsDirs;
