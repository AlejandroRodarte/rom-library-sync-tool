import { type ReaddirError } from "./readdir.helper.js";
import path from "path";
import realpath, { type RealpathError } from "./realpath.helper.js";
import stat, { type StatError } from "./stat.helper.js";
import type { DeviceFileIOLsEntry } from "../../interfaces/device-file-io-ls-entry.interface.js";

export type GetFileSymlinksFromDeviceFileIOLsEntries =
  | ReaddirError
  | RealpathError
  | StatError;

const getFileSymlinksFromDeviceFileIOLsEntries = async (
  list: DeviceFileIOLsEntry[],
): Promise<
  | [DeviceFileIOLsEntry[], undefined]
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
