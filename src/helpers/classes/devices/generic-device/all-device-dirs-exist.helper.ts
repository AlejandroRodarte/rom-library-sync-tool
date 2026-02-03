import FileIOExtras, {
  type AllDirsExistMethodError,
  type AllDirsExistMethodFalseResult,
  type DirAccessItem as FileIODirAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";

export type AllDeviceDirsExistError =
  | AllDirsExistMethodError
  | AllDirsExistMethodFalseResult["error"];

const allDeviceDirsExist = async (
  paths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
  rights: "r" | "w" | "rw" = "r",
): Promise<AllDeviceDirsExistError | undefined> => {
  const deviceDirAccessItems: FileIODirAccessItem[] = paths.map((p) => ({
    path: p,
    rights,
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) return allDeviceDirsExistError;
  if (!allDeviceDirsExistResult.allExist) return allDeviceDirsExistResult.error;
};

export default allDeviceDirsExist;
