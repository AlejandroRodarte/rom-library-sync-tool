import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";

const getRomsListsDeviceDirs = (
  paths: AlejandroG751JTPaths["dirs"]["content-targets"],
  consoleNames: ConsoleName[],
): string[] => {
  const dirs: string[] = [paths.roms.base];

  for (const consoleName of consoleNames) {
    const consoleRomsDir = paths.roms.consoles[consoleName];
    if (consoleRomsDir) dirs.push(consoleRomsDir);
  }

  return dirs;
};

export default getRomsListsDeviceDirs;
