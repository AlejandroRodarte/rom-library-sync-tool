import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const getRomsListsProjectDirs = (paths: AlejandroG751JTPaths): string[] => {
  const dirs: string[] = [paths.dirs.project.lists["content-targets"].roms];
  return dirs;
};

export default getRomsListsProjectDirs;
