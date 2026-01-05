import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import accessPath from "./access-path.helper.js";

const dirExists = async (dirPath: PathLike): Promise<Error | undefined> => {
  const dirAccessError = await accessPath("dir", dirPath, fs.constants.F_OK);
  if (dirAccessError) return dirAccessError;
};

export default dirExists;
