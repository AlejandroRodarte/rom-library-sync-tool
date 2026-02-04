import FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import { READ, READ_WRITE } from "../../../../constants/rights.constants.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";
import allDeviceDirsExist, {
  type AllDeviceDirsExistError,
} from "./all-device-dirs-exist.helper.js";
import allDeviceFilesExist from "./all-device-files-exist.helper.js";
import allProjectDirsExist, {
  type AllProjectDirsExistError,
} from "./all-project-dirs-exist.helper.js";

export type ValidateListPathsError =
  | AllProjectDirsExistError
  | AllDeviceDirsExistError;

const validateListPaths = async (
  paths: ListPaths,
  fileIOExtras: FileIOExtras,
): Promise<ValidateListPathsError | undefined> => {
  const projectDirsValidationError = await allProjectDirsExist(
    paths.project.dirs,
    READ_WRITE,
  );
  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await allDeviceDirsExist(
    paths.device.dirs,
    fileIOExtras.allDirsExist,
    READ,
  );
  if (deviceDirsValidationError) return deviceDirsValidationError;

  if (!paths.device.files) return undefined;

  const deviceFilesValidationError = await allDeviceFilesExist(
    paths.device.files,
    fileIOExtras.allFilesExist,
    READ,
  );
  if (deviceFilesValidationError) return deviceFilesValidationError;
};

export default validateListPaths;
