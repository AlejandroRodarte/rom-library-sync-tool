import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const buildRomsListsProjectDirPaths = (
  paths: AlejandroG751JTPaths["dirs"]["project"],
): string[] => [
  paths.base,
  paths.lists.base,
  paths.lists["content-targets"].roms,
];

export default buildRomsListsProjectDirPaths;
