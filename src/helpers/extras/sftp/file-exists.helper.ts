import Client from "ssh2-sftp-client";
import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type FileExistsResult = ExistsResult;
export type FileExistsError = ExistsError;

const fileExists = async (
  client: Client,
  filePath: string,
  rights?: "r" | "w" | "rw",
): Promise<[FileExistsResult, undefined] | [undefined, FileExistsError]> => {
  const [existsResult, existsError] = await exists(
    client,
    "file",
    filePath,
    rights,
  );

  if (existsError) return [undefined, existsError];
  return [existsResult, undefined];
};

export default fileExists;
