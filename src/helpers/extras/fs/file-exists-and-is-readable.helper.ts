import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import access, { type AccessPathError } from "./access.helper.js";

export type FileExistsAndIsReadableError = AccessPathError;

const fileExistsAndIsReadable = async (
  filePath: PathLike,
): Promise<undefined | FileExistsAndIsReadableError> =>
  await access("file", filePath, fs.constants.R_OK);

export default fileExistsAndIsReadable;
