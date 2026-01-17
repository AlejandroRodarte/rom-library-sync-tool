import type { PathLike } from "node:fs";
import access, { type AccessPathError } from "./access.helper.js";

export type SymlinkExistsError = AccessPathError;

const symlinkExists = async (
  linkPath: PathLike,
): Promise<SymlinkExistsError | undefined> => {
  const accessError = await access("link", linkPath);
  return accessError;
};

export default symlinkExists;
