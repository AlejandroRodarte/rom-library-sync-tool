import FileIOExtras, {
  type AllDirsExistMethodError,
  type AllDirsExistMethodFalseResult,
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";

export type ValidateRomsListsDeviceDirsError =
  | AllDirsExistMethodError
  | AllDirsExistMethodFalseResult["error"];

const validateRomsListsDeviceDirs = async (
  paths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateRomsListsDeviceDirsError | undefined> => {
  const deviceDirAccessItems: FileIODirAccessItem[] = paths.map((p) => ({
    path: p,
    rights: "r",
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) return allDeviceDirsExistError;
  if (!allDeviceDirsExistResult.allExist) return allDeviceDirsExistResult.error;
};

export default validateRomsListsDeviceDirs;
