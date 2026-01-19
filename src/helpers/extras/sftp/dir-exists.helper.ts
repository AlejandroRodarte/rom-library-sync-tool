import Client from "ssh2-sftp-client";
import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type DirExistsResult = ExistsResult;
export type DirExistsError = ExistsError;

const dirExists = async (
  client: Client,
  dirPath: string,
  rights?: "r" | "w" | "rw",
): Promise<[DirExistsResult, undefined] | [undefined, DirExistsError]> => {
  const [existsResult, existsError] = await exists(
    client,
    "dir",
    dirPath,
    rights,
  );

  if (existsError) return [undefined, existsError];
  return [existsResult, undefined];
};

export default dirExists;
