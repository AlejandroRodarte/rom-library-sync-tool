import fs from "node:fs/promises";
import type { PathLike } from "node:fs";

const accessPath = async (
  type: "file" | "dir",
  path: PathLike,
  mode?: number,
): Promise<undefined | Error> => {
  try {
    await fs.access(path, mode);
    const stats = await fs.stat(path);
    switch (type) {
      case "file":
        if (!stats.isFile())
          return new Error("Path is visible, but is not a file.");
        return undefined;
      case "dir":
        if (!stats.isDirectory())
          return new Error("Path is visible, but is not a directory.");
        return undefined;
      default:
        return new Error(
          "accessPath() only supports checking for files and directories.",
        );
    }
  } catch (e: unknown) {
    if (e instanceof Error) return e;
    else return new Error("accessPath(): an unkwown error has happened.");
  }
};

export default accessPath;
