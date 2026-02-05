import type {
  AllDirsExistMethodError,
  AllDirsExistMethodFalseResult,
} from "../../../../../../classes/file-io/file-io-extras.class.js";
import type FileIOExtras from "../../../../../../classes/file-io/file-io-extras.class.js";
import { READ } from "../../../../../../constants/rights/rights.constants.js";
import type { RightsForValidation } from "../../../../../../types/rights/rights-for-validation.type.js";
import { type DirAccessItem as FileIODirAccessItem } from "../../../../../../classes/file-io/file-io-extras.class.js";

export type AllDeviceDirsExistError =
  | AllDirsExistMethodError
  | AllDirsExistMethodFalseResult["error"];

const allDeviceDirsExist = async (
  paths: string[],
  allDirsExist: FileIOExtras["allDirsExist"],
  rights: RightsForValidation = READ,
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
