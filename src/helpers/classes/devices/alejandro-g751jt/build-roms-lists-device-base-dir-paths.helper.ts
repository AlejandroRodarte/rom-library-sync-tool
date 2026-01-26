import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const buildRomsDeviceBaseDirPaths = (
  paths: AlejandroG751JTPaths["dirs"]["content-targets"]["roms"],
): string[] => [paths.base];

export default buildRomsDeviceBaseDirPaths;
