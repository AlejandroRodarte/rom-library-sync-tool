import type { Dirent } from "node:fs";
import buildTitlesFromDirEntries from "./build-titles-from-dir-entries.helper.js";
import type AppConversionError from "../../../../../../classes/errors/app-conversion-error.class.js";
import type { Titles } from "../../../../../../types/roms/titles.type.js";
import readdir, {
  type ReaddirError,
} from "../../../../../wrappers/modules/fs/readdir.helper.js";

export type TitlesFromRomsDirPathError = ReaddirError;

const buildTitlesFromRomsDirPath = async (
  romsDirPath: string,
  dirEntryToTitleNameFn: (
    dirEntry: Dirent<NonSharedBuffer>,
  ) => [string, undefined] | [undefined, AppConversionError],
): Promise<[Titles, undefined] | [undefined, TitlesFromRomsDirPathError]> => {
  const [entries, readdirError] = await readdir(romsDirPath, {
    withFileTypes: true,
    encoding: "buffer",
  });

  if (readdirError) return [undefined, readdirError];

  const titles = buildTitlesFromDirEntries(entries, dirEntryToTitleNameFn);
  return [titles, undefined];
};

export default buildTitlesFromRomsDirPath;
