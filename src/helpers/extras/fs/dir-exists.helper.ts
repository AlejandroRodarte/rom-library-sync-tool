import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type DirExistsResult = ExistsResult;
export type DirExistsError = ExistsError;

const dirExists = async (
  dirPath: string,
  rights?: "r" | "w" | "rw",
): Promise<[DirExistsResult, undefined] | [undefined, DirExistsError]> => {
  const [dirExists, existsError] = await exists("dir", dirPath, rights);

  if (existsError) return [undefined, existsError];
  return [dirExists, undefined];
};

export default dirExists;
