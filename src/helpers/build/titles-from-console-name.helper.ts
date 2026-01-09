import type { Titles } from "../../types.js";
import titlesFromFilenames from "./titles-from-filenames.helper.js";
import path from "node:path";
import ENVIRONMENT from "../../constants/environment.constant.js";
import fileIO from "../file-io/index.js";
import type { ReaddirError } from "../file-io/readdir.helper.js";

export type TitlesFromConsoleNameError = ReaddirError;

const titlesFromConsoleName = async (
  consoleName: string,
): Promise<[Titles, undefined] | [undefined, TitlesFromConsoleNameError]> => {
  const consoleRomsDirPath = path.join(ENVIRONMENT.paths.dbs.roms, consoleName);

  const [entries, readdirError] = await fileIO.readdir([
    consoleRomsDirPath,
    { withFileTypes: true, encoding: "buffer" },
  ]);

  if (readdirError) return [undefined, readdirError];

  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((e) => e.name.toString());
  const titles = titlesFromFilenames(filenames);
  return [titles, undefined];
};

export default titlesFromConsoleName;
