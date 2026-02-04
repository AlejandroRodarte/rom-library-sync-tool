import Client from "ssh2-sftp-client";
import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";
import type { RightsForValidation } from "../../../types/rights-for-validation.type.js";
import { DIR } from "../../../constants/fs-types.constants.js";

export type DirExistsResult = ExistsResult;
export type DirExistsError = ExistsError;

const dirExists = async (
  client: Client,
  dirPath: string,
  rights?: RightsForValidation,
): Promise<[DirExistsResult, undefined] | [undefined, DirExistsError]> => {
  const [existsResult, existsError] = await exists(
    client,
    DIR,
    dirPath,
    rights,
  );

  if (existsError) return [undefined, existsError];
  return [existsResult, undefined];
};

export default dirExists;
