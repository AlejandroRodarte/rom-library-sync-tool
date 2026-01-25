import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { AlejandroG751JTRomsDiffsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-roms-diffs-dir-paths.interface.js";
import buildRomsDiffsProjectDirPaths from "./build-roms-diffs-project-dir-paths.helper.js";
import buildRomsListsProjectDirPaths from "./build-roms-lists-project-dir-paths.helper.js";

const buildRomsDiffsDirPaths = (
  paths: AlejandroG751JTPaths["dirs"],
): AlejandroG751JTRomsDiffsDirPaths => {
  const romsPaths: AlejandroG751JTRomsDiffsDirPaths = {
    project: {
      lists: buildRomsListsProjectDirPaths(paths.project),
      diffs: buildRomsDiffsProjectDirPaths(paths.project),
    },
  };
  return romsPaths;
};

export default buildRomsDiffsDirPaths;
