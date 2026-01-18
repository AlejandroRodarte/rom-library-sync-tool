import path from "path";
import type { FileIOLsEntry } from "../../../interfaces/file-io-ls-entry.interface.js";
import realpath, { type RealpathError } from "../../wrappers/modules/fs/realpath.helper.js";
import stat, { type StatError } from "../../wrappers/modules/fs/stat.helper.js";
import type { ReaddirError } from "../../wrappers/modules/fs/readdir.helper.js";

export type GetFileSymlinksFromDeviceFileIOLsEntries =
  | ReaddirError
  | RealpathError
  | StatError;

const getFileSymlinksFromDeviceFileIOLsEntries = async (
  list: FileIOLsEntry[],
): Promise<
  | [FileIOLsEntry[], undefined]
  | [undefined, GetFileSymlinksFromDeviceFileIOLsEntries]
> => {
  const symlinks = list.filter((e) => e.is.link);
  const symlinkEntryIndexesToDelete: number[] = [];

  for (const [index, symlink] of symlinks.entries()) {
    const symlinkPath = path.resolve(symlink.path);

    const [targetPath, realpathError] = await realpath(symlinkPath);
    if (realpathError) return [undefined, realpathError];

    const [targetStats, statError] = await stat(targetPath);
    if (statError) return [undefined, statError];

    if (!targetStats.isFile()) symlinkEntryIndexesToDelete.push(index);
  }

  for (const index of symlinkEntryIndexesToDelete) symlinks.splice(index, 1);

  return [symlinks, undefined];
};

export default getFileSymlinksFromDeviceFileIOLsEntries;
