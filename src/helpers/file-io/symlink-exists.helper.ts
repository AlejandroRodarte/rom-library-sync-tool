import type { PathLike } from "node:fs";
import accessPath from "./access-path.helper.js";

const symlinkExists = async (linkPath: PathLike) => {
  const accessError = await accessPath("link", linkPath);
  return accessError;
};

export default symlinkExists;
