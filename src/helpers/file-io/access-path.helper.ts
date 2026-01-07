import type { PathLike } from "node:fs";
import access, { type AccessError } from "./access.helper.js";
import stats, { type StatsError } from "./stats.helper.js";
import FsWrongTypeError from "../../classes/errors/fs-wrong-type-error.class.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";

export type AccessPathError = AccessError | StatsError | FsWrongTypeError;

const accessPath = async (
  type: "file" | "dir",
  path: PathLike,
  mode?: number,
): Promise<undefined | AccessPathError> => {
  const accessError = await access(path, mode);
  if (accessError) return accessError;

  const [pathStats, statsError] = await stats(path);
  if (statsError) return statsError;

  switch (type) {
    case "file":
      if (!pathStats.isFile())
        return new FsWrongTypeError(`Path ${path} exists, but is NOT a file.`);
    case "dir":
      if (!pathStats.isDirectory())
        return new FsWrongTypeError(
          `Path ${path} exists, but is NOT a directory.`,
        );
    default:
      return new UnknownError(
        `Path ${path} exists, but is neither a file or a directory.`,
      );
  }
};

export default accessPath;
