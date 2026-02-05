import type {
  AllFilesExistMethodError,
  AllFilesExistMethodFalseResult,
} from "../../../../../../classes/file-io/file-io-extras.class.js";
import type FileIOExtras from "../../../../../../classes/file-io/file-io-extras.class.js";
import { READ } from "../../../../../../constants/rights/rights.constants.js";
import type { RightsForValidation } from "../../../../../../types/rights/rights-for-validation.type.js";
import { type FileAccessItem as FileIOFileAccessItem } from "../../../../../../classes/file-io/file-io-extras.class.js";

export type AllDeviceFilesExistError =
  | AllFilesExistMethodError
  | AllFilesExistMethodFalseResult["error"];

const allDeviceFilesExist = async (
  paths: string[],
  allFilesExist: FileIOExtras["allFilesExist"],
  rights: RightsForValidation = READ,
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
