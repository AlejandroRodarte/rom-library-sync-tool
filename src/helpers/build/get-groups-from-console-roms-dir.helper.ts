import { readdir } from "node:fs/promises";
import type { Groups } from "../../types.js";
import buildGroupsFromFilenames from "./build-groups-from-filenames.helper.js";
import path from "node:path";
import { ROMS_DIR_PATH } from "../../constants/paths.constants.js";

const getGroupsFromConsoleRomsDir = async (
  consoleName: string,
): Promise<Groups> => {
  const consoleRomsDirPath = path.resolve(ROMS_DIR_PATH, consoleName);
  const entries = await readdir(consoleRomsDirPath, { withFileTypes: true });
  const filenames = entries
    .filter((entry) => entry.isFile())
    .map((e) => e.name);
  const groups = buildGroupsFromFilenames(filenames);
  return groups;
};

export default getGroupsFromConsoleRomsDir;
