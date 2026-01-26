import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";

const buildMediaListPaths = (paths: AlejandroG751JTPaths): ListPaths => {
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
