import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const buildRomsDiffsProjectDirPaths = (
  paths: AlejandroG751JTPaths["dirs"]["project"],
): string[] => [
  paths.base,
  paths.diffs.base,
  paths.diffs["content-targets"].roms,
];

export default buildRomsDiffsProjectDirPaths;
