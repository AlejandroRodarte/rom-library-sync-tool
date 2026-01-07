import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import accessPath, { type AccessPathError } from "./access-path.helper.js";

export type FileExistsError = AccessPathError;

const fileExists = async (
  filePath: PathLike,
): Promise<FileExistsError | undefined> => {
  const fileAccessError = await accessPath("file", filePath, fs.constants.F_OK);
  if (fileAccessError) return fileAccessError;
};

export default fileExists;
