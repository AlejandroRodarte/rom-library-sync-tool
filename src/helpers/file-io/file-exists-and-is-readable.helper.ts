import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import accessPath, { type AccessPathError } from "./access-path.helper.js";

export type FileExistsAndIsReadableError = AccessPathError;

const fileExistsAndIsReadable = async (
  filePath: PathLike,
): Promise<undefined | FileExistsAndIsReadableError> =>
  await accessPath("file", filePath, fs.constants.R_OK);

export default fileExistsAndIsReadable;
