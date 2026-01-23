import type { AlejandroG751JTMediaListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-lists-dir-paths.interface.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const buildMediaListsDirPaths = (
  paths: AlejandroG751JTPaths["dirs"],
): AlejandroG751JTMediaListsDirPaths => {
  const mediaPaths: AlejandroG751JTMediaListsDirPaths = {
    project: [],
    device: {
      base: [],
    },
  };

  mediaPaths.project.push(
    paths.project.base,
    paths.project.lists.base,
    paths.project.lists["content-targets"].media.base,
  );

  mediaPaths.device.base.push(paths["content-targets"].media.base);

  for (const [, mediaNameDirPath] of Object.entries(
    paths.project.lists["content-targets"].media.names,
  ))
    mediaPaths.project.push(mediaNameDirPath);

  for (const [, consoleMediaDirPaths] of Object.entries(
    paths["content-targets"].media.consoles,
  ))
    mediaPaths.device.base.push(consoleMediaDirPaths.base);

  return mediaPaths;
};

export default buildMediaListsDirPaths;
