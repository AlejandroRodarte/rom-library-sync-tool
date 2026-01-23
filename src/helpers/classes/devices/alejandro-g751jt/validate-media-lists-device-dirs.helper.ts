import FileIOExtras, {
  type AllDirsExistMethodError,
  type AllDirsExistMethodFalseResult,
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";

export type ValidateMediaListsDeviceDirsError =
  | AllDirsExistMethodError
  | AllDirsExistMethodFalseResult["error"];

const validateMediaListsDeviceDirs = async (
  dirPaths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
): Promise<ValidateMediaListsDeviceDirsError | undefined> => {
  const deviceDirAccessItems: FileIODirAccessItem[] = dirPaths.map((p) => ({
    type: "dir",
    path: p,
    rights: "r",
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) return allDeviceDirsExistError;
  if (!allDeviceDirsExistResult.allExist) return allDeviceDirsExistResult.error;
};

export default validateMediaListsDeviceDirs;
