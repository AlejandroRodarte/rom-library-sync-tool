import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import accessPath from "./access-path.helper.js";

const fileExists = async (filePath: PathLike): Promise<Error | undefined> => {
  const fileAccessError = await accessPath("file", filePath, fs.constants.F_OK);
  if (fileAccessError) return fileAccessError;
};

export default fileExists;
