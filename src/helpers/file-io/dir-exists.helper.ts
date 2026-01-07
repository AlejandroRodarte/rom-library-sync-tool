import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import accessPath, { type AccessPathError } from "./access-path.helper.js";

export type DirExistsError = AccessPathError;

const dirExists = async (
  dirPath: PathLike,
): Promise<DirExistsError | undefined> => {
  const dirAccessError = await accessPath("dir", dirPath, fs.constants.F_OK);
  if (dirAccessError) return dirAccessError;
};

export default dirExists;
