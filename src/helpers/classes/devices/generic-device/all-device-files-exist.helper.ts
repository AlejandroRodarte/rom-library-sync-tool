import type {
  AllFilesExistMethodError,
  AllFilesExistMethodFalseResult,
  FileAccessItem as FileIOFileAccessItem,
} from "../../../../classes/file-io/file-io-extras.class.js";
import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";

export type AllDeviceFilesExistError =
  | AllFilesExistMethodError
  | AllFilesExistMethodFalseResult["error"];

const allDeviceFilesExist = async (
  paths: string[],
  allFilesExist: FileIOExtras["allFilesExist"],
  rights: "r" | "w" | "rw" = "r",
) => {
  const fileAccessItems: FileIOFileAccessItem[] = paths.map((p) => ({
    path: p,
    rights,
  }));

  const [allFilesExistResult, allFilesExistError] =
    await allFilesExist(fileAccessItems);

  if (allFilesExistError) return allFilesExistError;
  if (!allFilesExistResult.allExist) return allFilesExistResult.error;
};

export default allDeviceFilesExist;
