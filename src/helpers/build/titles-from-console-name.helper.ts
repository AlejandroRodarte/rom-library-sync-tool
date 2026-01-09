import { readdir } from "node:fs/promises";
import type { Titles } from "../../types.js";
import titlesFromFilenames from "./titles-from-filenames.helper.js";
import path from "node:path";
import ENVIRONMENT from "../../constants/environment.constant.js";

const titlesFromConsoleName = async (consoleName: string): Promise<Titles> => {
  const consoleRomsDirPath = path.join(ENVIRONMENT.paths.dbs.roms, consoleName);
  const entries = await readdir(consoleRomsDirPath, { withFileTypes: true });
  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((e) => e.name);
  const titles = titlesFromFilenames(filenames);
  return titles;
};

export default titlesFromConsoleName;
