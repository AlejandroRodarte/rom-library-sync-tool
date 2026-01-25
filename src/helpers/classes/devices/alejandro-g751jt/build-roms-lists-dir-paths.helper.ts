import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { AlejandroG751JTRomsListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-roms-lists-dir-paths.interface.js";
import buildRomsListsDeviceBaseDirPaths from "./build-roms-lists-device-base-dir-paths.helper.js";
import buildRomsListsProjectDirPaths from "./build-roms-lists-project-dir-paths.helper.js";

const buildRomsListsDirPaths = (
  paths: AlejandroG751JTPaths["dirs"],
): AlejandroG751JTRomsListsDirPaths => {
  const romsPaths: AlejandroG751JTRomsListsDirPaths = {
    project: buildRomsListsProjectDirPaths(paths.project),
    device: {
      base: buildRomsListsDeviceBaseDirPaths(paths["content-targets"].roms),
    },
  };
  return romsPaths;
};

export default buildRomsListsDirPaths;
