import FileIOExtras, {
  type AllDirsExistMethodError,
  type AllDirsExistMethodFalseResult,
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";

export type ValidateDeviceDirsError =
  | AllDirsExistMethodError
  | AllDirsExistMethodFalseResult["error"];

const validateDeviceDirs = async (
  paths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
  rights: "r" | "w" | "rw" = "r",
): Promise<ValidateDeviceDirsError | undefined> => {
  const deviceDirAccessItems: FileIODirAccessItem[] = paths.map((p) => ({
    path: p,
    rights,
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) return allDeviceDirsExistError;
  if (!allDeviceDirsExistResult.allExist) return allDeviceDirsExistResult.error;
};

export default validateDeviceDirs;
