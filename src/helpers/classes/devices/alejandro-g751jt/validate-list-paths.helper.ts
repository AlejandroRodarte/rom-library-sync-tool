import FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";
import allDeviceDirsExist, {
  type AllDeviceDirsExistError,
} from "./all-device-dirs-exist.helper.js";
import allProjectDirsExist, {
  type AllProjectDirsExistError,
} from "./all-project-dirs-exist.helper.js";

export type ValidateListPathsError =
  | AllProjectDirsExistError
  | AllDeviceDirsExistError;

const validateListPaths = async (
  paths: ListPaths,
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateListPathsError | undefined> => {
  const projectDirsValidationError = await allProjectDirsExist(
    paths.project.dirs,
    "rw",
  );
  if (projectDirsValidationError) return projectDirsValidationError;

  const deviceDirsValidationError = await allDeviceDirsExist(
    paths.device.dirs,
    allDirsExist,
    "r",
  );
  if (deviceDirsValidationError) return deviceDirsValidationError;
};

export default validateListPaths;
