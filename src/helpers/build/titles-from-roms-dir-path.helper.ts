import type { Titles } from "../../types/titles.type.js";
import readdir, {
  type ReaddirError,
} from "../wrappers/modules/fs/readdir.helper.js";
import titlesFromDirEntries from "./titles-from-dir-entries.helper.js";

export type TitlesFromRomsDirPathError = ReaddirError;

const titlesFromRomsDirPath = async (
  romsDirPath: string,
): Promise<[Titles, undefined] | [undefined, TitlesFromRomsDirPathError]> => {
  const [entries, readdirError] = await readdir(romsDirPath, {
    withFileTypes: true,
    encoding: "buffer",
  });

  if (readdirError) return [undefined, readdirError];

  const titles = titlesFromDirEntries(entries);
  return [titles, undefined];
};

export default titlesFromRomsDirPath;
