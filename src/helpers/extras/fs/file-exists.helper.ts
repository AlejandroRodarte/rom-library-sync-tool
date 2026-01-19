import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type FileExistsResult = ExistsResult;
export type FileExistsError = ExistsError;

const fileExists = async (
  filePath: string,
  rights?: "r" | "w" | "rw",
): Promise<[FileExistsResult, undefined] | [undefined, FileExistsError]> => {
  const [fileExists, existsError] = await exists("file", filePath, rights);

  if (existsError) return [undefined, existsError];
  return [fileExists, undefined];
};

export default fileExists;
