import Client from "ssh2-sftp-client";
import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";
import type { RightsForValidation } from "../../../types/rights-for-validation.type.js";
import { FILE } from "../../../constants/fs-types.constants.js";

export type FileExistsResult = ExistsResult;
export type FileExistsError = ExistsError;

const fileExists = async (
  client: Client,
  filePath: string,
  rights?: RightsForValidation,
): Promise<[FileExistsResult, undefined] | [undefined, FileExistsError]> => {
  const [existsResult, existsError] = await exists(
    client,
    FILE,
    filePath,
    rights,
  );

  if (existsError) return [undefined, existsError];
  return [existsResult, undefined];
};

export default fileExists;
