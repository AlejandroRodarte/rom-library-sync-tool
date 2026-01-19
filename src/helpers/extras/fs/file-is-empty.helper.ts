import type { FileExistsError } from "./file-exists.helper.js";
import stat, { type StatError } from "../../wrappers/modules/fs/stat.helper.js";
import fileExists from "./file-exists.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";

export type FileIsEmptyError = FileExistsError | ExistsFalseErrors | StatError;

const fileIsEmpty = async (
  filePath: string,
): Promise<[boolean, undefined] | [undefined, FileIsEmptyError]> => {
  const [existsResult, existsError] = await fileExists(filePath, "r");

  if (existsError) return [undefined, existsError];
  if (!existsResult.exists) return [undefined, existsResult.error];

  const [fileStats, statsError] = await stat(filePath);
  if (statsError) return [undefined, statsError];

  return [fileStats.size === 0, undefined];
};

export default fileIsEmpty;
