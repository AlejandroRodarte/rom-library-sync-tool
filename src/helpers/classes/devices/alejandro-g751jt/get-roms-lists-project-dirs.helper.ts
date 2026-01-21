import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const getRomsListsProjectDirs = (
  paths: AlejandroG751JTPaths["dirs"]["project"]["lists"]["content-targets"]["roms"],
): string[] => {
  const dirs: string[] = [paths];
  return dirs;
};

export default getRomsListsProjectDirs;
