import fileExistsAndIsReadable, {
  type FileExistsAndIsReadableError,
} from "./file-exists-and-is-readable.helper.js";
import type { PathLike } from "node:fs";
import type { StatsError } from "./stats.helper.js";
import stats from "./stats.helper.js";
import type { FileExistsError } from "./file-exists.helper.js";

export type FileIsEmptyError = FileExistsAndIsReadableError | StatsError;

const fileIsEmpty = async (
  filePath: PathLike,
): Promise<[boolean, undefined] | [undefined, FileExistsError]> => {
  const fileExistsError = await fileExistsAndIsReadable(filePath);
  if (fileExistsError) return [undefined, fileExistsError];

  const [fileStats, statsError] = await stats(filePath);
  if (statsError) return [undefined, statsError];

  return [fileStats.size === 0, undefined];
};

export default fileIsEmpty;
