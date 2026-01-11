import type { Titles } from "../../types.js";
import titlesFromFilenames from "./titles-from-filenames.helper.js";
import fileIO from "../file-io/index.js";
import type { ReaddirError } from "../file-io/readdir.helper.js";

export type TitlesFromRomsDirPath = ReaddirError;

const titlesFromRomsDirPath = async (
  romsDirPath: string,
): Promise<[Titles, undefined] | [undefined, TitlesFromRomsDirPath]> => {
  const [entries, readdirError] = await fileIO.readdir([
    romsDirPath,
    { withFileTypes: true, encoding: "buffer" },
  ]);

  if (readdirError) return [undefined, readdirError];

  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((e) => e.name.toString());
  const titles = titlesFromFilenames(filenames);
  return [titles, undefined];
};

export default titlesFromRomsDirPath;
