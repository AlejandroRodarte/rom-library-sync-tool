import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";

const getRomsListsDeviceDirs = (
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
): string[] => {
  const dirs: string[] = [paths.dirs["content-targets"].roms.base];

  for (const consoleName of consoleNames) {
    const consoleRomsDir =
      paths.dirs["content-targets"].roms.consoles[consoleName];
    if (consoleRomsDir) dirs.push(consoleRomsDir);
  }

  return dirs;
};

export default getRomsListsDeviceDirs;
