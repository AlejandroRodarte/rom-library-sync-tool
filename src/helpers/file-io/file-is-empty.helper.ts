import fs from "node:fs/promises";
import fileExistsAndIsReadable from "./file-exists-and-is-readable.helper.js";
import type { PathLike } from "node:fs";

const fileIsEmpty = async (
  filePath: PathLike,
): Promise<[boolean, undefined] | [undefined, Error]> => {
  const fileExistsError = await fileExistsAndIsReadable(filePath);
  if (fileExistsError) return [undefined, fileExistsError];

  const stat = await fs.stat(filePath);
  return [stat.size === 0, undefined];
};

export default fileIsEmpty;
