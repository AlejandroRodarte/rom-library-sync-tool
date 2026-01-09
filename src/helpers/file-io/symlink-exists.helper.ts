import type { PathLike } from "node:fs";
import accessPath, { type AccessPathError } from "./access-path.helper.js";

export type SymlinkExistsError = AccessPathError;

const symlinkExists = async (
  linkPath: PathLike,
): Promise<SymlinkExistsError | undefined> => {
  const accessError = await accessPath("link", linkPath);
  return accessError;
};

export default symlinkExists;
