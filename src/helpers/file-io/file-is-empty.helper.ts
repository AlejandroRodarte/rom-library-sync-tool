import type { PathLike } from "node:fs";
import fileExistsAndIsReadable, {
  type FileExistsAndIsReadableError,
} from "./file-exists-and-is-readable.helper.js";
import type { FileExistsError } from "./file-exists.helper.js";
import stat, { type StatError } from "../wrappers/modules/fs/stat.helper.js";

export type FileIsEmptyError = FileExistsAndIsReadableError | StatError;

const fileIsEmpty = async (
  filePath: PathLike,
): Promise<[boolean, undefined] | [undefined, FileExistsError]> => {
  const fileExistsError = await fileExistsAndIsReadable(filePath);
  if (fileExistsError) return [undefined, fileExistsError];

  const [fileStats, statsError] = await stat(filePath);
  if (statsError) return [undefined, statsError];

  return [fileStats.size === 0, undefined];
};

export default fileIsEmpty;
