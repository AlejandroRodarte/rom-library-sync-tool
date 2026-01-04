import fs from "node:fs/promises";
import type { PathLike } from "node:fs";
import accessPath from "./access-path.helper.js";

const fileExistsAndIsReadable = async (
  filePath: PathLike,
): Promise<undefined | Error> =>
  await accessPath("file", filePath, fs.constants.R_OK);

export default fileExistsAndIsReadable;
