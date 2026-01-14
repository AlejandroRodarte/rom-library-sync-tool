import readdir, { type ReaddirError } from "./readdir.helper.js";
import path from "path";
import realpath, { type RealpathError } from "./realpath.helper.js";
import stat, { type StatError } from "./stat.helper.js";
import type { Dirent } from "fs";

export type ReadDirAndGetFileSymlinksError =
  | ReaddirError
  | RealpathError
  | StatError;

const readDirAndGetFileSymlinks = async (
  dirPath: string,
): Promise<
  | [Dirent<NonSharedBuffer>[], undefined]
  | [undefined, ReadDirAndGetFileSymlinksError]
> => {
  const [entries, readDirError] = await readdir([
    dirPath,
    { withFileTypes: true, encoding: "buffer" },
  ]);

  if (readDirError) return [undefined, readDirError];

  const symlinks = entries.filter((e) => e.isSymbolicLink());
  const symlinkEntryIndexesToDelete: number[] = [];

  for (const [index, symlink] of symlinks.entries()) {
    const symlinkPath = path.resolve(dirPath, symlink.name.toString());

    const [targetPath, realpathError] = await realpath(symlinkPath);
    if (realpathError) return [undefined, realpathError];

    const [targetStats, statError] = await stat(targetPath);
    if (statError) return [undefined, statError];

    if (!targetStats.isFile()) symlinkEntryIndexesToDelete.push(index);
  }

  for (const index of symlinkEntryIndexesToDelete) symlinks.splice(index, 1);

  return [symlinks, undefined];
};

export default readDirAndGetFileSymlinks;
