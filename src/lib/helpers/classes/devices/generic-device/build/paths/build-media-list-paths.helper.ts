import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { ListPaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/list-paths.interface.js";

const buildMediaListPaths = (paths: GenericDevicePaths): ListPaths => {
  const deviceDirPaths: string[] = [paths.dirs["content-targets"].media.base];

  for (const [, consoleMediaPaths] of Object.entries(
    paths.dirs["content-targets"].media.consoles,
  ))
    deviceDirPaths.push(
      consoleMediaPaths.base,
      ...Object.values(consoleMediaPaths.names),
    );

  return {
    project: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.lists.base,
        ...Object.values(
          paths.dirs.project.lists["content-targets"].media.names,
        ),
      ],
    },
    device: {
      dirs: deviceDirPaths,
    },
  };
};

export default buildMediaListPaths;
