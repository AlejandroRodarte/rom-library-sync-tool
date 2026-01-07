import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import accessPath, { type AccessPathError } from "./access-path.helper.js";

export type DirExistsAndIsReadableError = AccessPathError;

const dirExistsAndIsReadable = async (
  dirPath: PathLike,
): Promise<DirExistsAndIsReadableError | undefined> => {
  const dirAccessError = await accessPath(
    "dir",
    dirPath,
    fs.constants.F_OK | fs.constants.R_OK,
  );
  if (dirAccessError) return dirAccessError;
};

export default dirExistsAndIsReadable;
