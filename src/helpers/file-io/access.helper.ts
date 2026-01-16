import type { PathLike } from "node:fs";
import FsWrongTypeError from "../../classes/errors/fs-wrong-type-error.class.js";
import rawAccess, {
  type AccessError,
} from "../wrappers/modules/fs/access.helper.js";
import stat, { type StatError } from "../wrappers/modules/fs/stat.helper.js";

export type AccessPathError = AccessError | StatError | FsWrongTypeError;

const access = async (
  type: "file" | "dir" | "link",
  path: PathLike,
  mode?: number,
): Promise<undefined | AccessPathError> => {
  const accessError = await rawAccess(path, mode);
  if (accessError) return accessError;

  const [pathStats, statsError] = await stat(path);
  if (statsError) return statsError;

  switch (type) {
    case "file":
      if (!pathStats.isFile())
        return new FsWrongTypeError(`Path ${path} exists, but is NOT a file.`);
      break;
    case "dir":
      if (!pathStats.isDirectory())
        return new FsWrongTypeError(
          `Path ${path} exists, but is NOT a directory.`,
        );
      break;
    case "link":
      if (!pathStats.isSymbolicLink())
        return new FsWrongTypeError(
          `Path ${path} exists, but is NOT a symbolic link.`,
        );
      break;
  }
};

export default access;
