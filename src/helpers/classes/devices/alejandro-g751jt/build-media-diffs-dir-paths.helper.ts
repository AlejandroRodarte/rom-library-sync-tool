import type { AlejandroG751JTMediaDiffsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-diffs-dir-paths.interface.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import buildMediaDiffsProjectDirPaths from "./build-media-diffs-project-dir-paths.helper.js";
import buildMediaListsProjectDirPaths from "./build-media-lists-project-dir-paths.helper.js";

const buildMediaDiffsDirPaths = (
  paths: AlejandroG751JTPaths["dirs"],
): AlejandroG751JTMediaDiffsDirPaths => {
  const mediaPaths: AlejandroG751JTMediaDiffsDirPaths = {
    project: {
      lists: buildMediaListsProjectDirPaths(paths.project),
      diffs: buildMediaDiffsProjectDirPaths(paths.project),
    },
  };
  return mediaPaths;
};

export default buildMediaDiffsDirPaths;
