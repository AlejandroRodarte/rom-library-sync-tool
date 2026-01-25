import type { AlejandroG751JTMediaListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-lists-dir-paths.interface.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import buildMediaListsDeviceBaseDirPaths from "./build-media-lists-device-base-dir-paths.helper.js";
import buildMediaListsProjectDirPaths from "./build-media-lists-project-dir-paths.helper.js";

const buildMediaListsDirPaths = (
  paths: AlejandroG751JTPaths["dirs"],
): AlejandroG751JTMediaListsDirPaths => {
  const mediaPaths: AlejandroG751JTMediaListsDirPaths = {
    project: buildMediaListsProjectDirPaths(paths.project),
    device: {
      base: buildMediaListsDeviceBaseDirPaths(paths["content-targets"].media),
    },
  };
  return mediaPaths;
};

export default buildMediaListsDirPaths;
