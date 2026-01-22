import type { AlejandroG751JTMediaListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-lists-dir-paths.interface.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";

const buildMediaListsDirPaths = (
  paths: AlejandroG751JTPaths["dirs"],
  consoleNames: ConsoleName[],
  mediaNames: MediaName[],
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

  for (const mediaName of mediaNames) {
    const projectMediaNameDir =
      paths.project.lists["content-targets"].media.names[mediaName];
    if (!projectMediaNameDir) continue;
    mediaPaths.project.push(projectMediaNameDir);
  }

  for (const consoleName of consoleNames) {
    const deviceConsoleMediaDirPaths =
      paths["content-targets"].media.consoles[consoleName];

    if (!deviceConsoleMediaDirPaths) continue;
    mediaPaths.device.base.push(deviceConsoleMediaDirPaths.base);
  }

  return mediaPaths;
};

export default buildMediaListsDirPaths;
