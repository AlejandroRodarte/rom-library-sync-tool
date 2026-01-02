import { readdir } from "node:fs/promises";
import type { Titles } from "../../types.js";
import titlesFromFilenames from "./titles-from-filenames.helper.js";
import path from "node:path";
import { LOCAL_ROMS_DIR_PATH } from "../../constants/paths.constants.js";

const titlesFromConsoleName = async (consoleName: string): Promise<Titles> => {
  const consoleRomsDirPath = path.resolve(LOCAL_ROMS_DIR_PATH, consoleName);
  const entries = await readdir(consoleRomsDirPath, { withFileTypes: true });
  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((e) => e.name);
  const groups = titlesFromFilenames(filenames);
  return groups;
};

export default titlesFromConsoleName;
