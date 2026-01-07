import type { PathLike } from "fs";
import type { Stats } from "node:fs";
import fs from "node:fs/promises";
import typeGuards from "../typescript/guards/index.js";
import UnknownError from "../../classes/errors/unknown-error.class.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import FsUnauthorizedError from "../../classes/errors/fs-unauthorized-error.class.js";

export type StatsError = UnknownError | FsNotFoundError | FsUnauthorizedError;

const stats = async (
  path: PathLike,
): Promise<[Stats, undefined] | [undefined, StatsError]> => {
  try {
    const stats = await fs.stat(path);
    return [stats, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error was thrown while calling the stats() function with path argument ${path}.`,
        ),
      ];

    switch (e.code) {
      case "ENOENT":
        return [
          undefined,
          new FsNotFoundError(`Item not found at path ${path}.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FsUnauthorizedError(
            `Can not compute statistics for path ${path} because this process is not authorized to do so.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something bad happened while fetching statistics. Error code: ${e.code}`,
          ),
        ];
    }
  }
};

export default stats;
