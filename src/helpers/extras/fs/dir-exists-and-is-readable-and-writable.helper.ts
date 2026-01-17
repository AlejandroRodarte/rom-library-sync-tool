import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import access, { type AccessPathError } from "./access.helper.js";

export type DirExistsAndIsReadableAndWritableError = AccessPathError;

const dirExistsAndIsReadableAndWritable = async (
  dirPath: PathLike,
): Promise<DirExistsAndIsReadableAndWritableError | undefined> => {
  const dirAccessError = await access(
    "dir",
    dirPath,
    fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK,
  );
  if (dirAccessError) return dirAccessError;
};

export default dirExistsAndIsReadableAndWritable;
