import titlesFromFilenames from "./titles-from-filenames.helper.js";
import type { Titles } from "../../types/titles.type.js";
import readdir, {
  type ReaddirError,
} from "../wrappers/modules/fs/readdir.helper.js";

const fsExtras = {
  readdir,
};

export type TitlesFromRomsDirPath = ReaddirError;

const titlesFromRomsDirPath = async (
  romsDirPath: string,
): Promise<[Titles, undefined] | [undefined, TitlesFromRomsDirPath]> => {
  const [entries, readdirError] = await fsExtras.readdir(romsDirPath, {
    withFileTypes: true,
    encoding: "buffer",
  });

  if (readdirError) return [undefined, readdirError];

  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((e) => e.name.toString());
  const titles = titlesFromFilenames(filenames);
  return [titles, undefined];
};

export default titlesFromRomsDirPath;
