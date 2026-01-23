import type { Titles } from "../../types/titles.type.js";
import readdir, {
  type ReaddirError,
} from "../wrappers/modules/fs/readdir.helper.js";
import titlesFromDirEntries from "./titles-from-dir-entries.helper.js";

export type TitlesFromRomsDirPath = ReaddirError;

const titlesFromRomsDirPath = async (
  romsDirPath: string,
): Promise<[Titles, undefined] | [undefined, TitlesFromRomsDirPath]> => {
  const [entries, readdirError] = await readdir(romsDirPath, {
    withFileTypes: true,
    encoding: "buffer",
  });

  if (readdirError) return [undefined, readdirError];

  const dirEntries = entries.filter(
    (entry) => entry.isFile() || entry.isDirectory(),
  );

  const titles = titlesFromDirEntries(dirEntries);
  return [titles, undefined];
};

export default titlesFromRomsDirPath;
