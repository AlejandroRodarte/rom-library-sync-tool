import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { AlejandroG751JTRomsListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-roms-lists-dir-paths.interface.js";
const buildRomsListsDirPaths = (
  paths: AlejandroG751JTPaths["dirs"],
): AlejandroG751JTRomsListsDirPaths => {
  const romsPaths: AlejandroG751JTRomsListsDirPaths = {
    project: [],
    device: {
      base: [],
    },
  };

  romsPaths.project.push(
    paths.project.base,
    paths.project.lists.base,
    paths.project.lists["content-targets"].roms,
  );

  romsPaths.device.base.push(paths["content-targets"].roms.base);
  return romsPaths;
};

export default buildRomsListsDirPaths;
