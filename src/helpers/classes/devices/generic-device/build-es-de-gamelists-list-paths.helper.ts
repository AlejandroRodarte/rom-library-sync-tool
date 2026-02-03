import type { GenericDevicePaths } from "../../../../interfaces/devices/generic-device/generic-device-paths.interface.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";

const buildEsDeGamelistsListPaths = (paths: GenericDevicePaths): ListPaths => ({
  project: {
    dirs: [
      paths.dirs.project.base,
      paths.dirs.project.lists.base,
      paths.dirs.project.lists["content-targets"]["es-de-gamelists"],
    ],
  },
  device: {
    dirs: [
      paths.dirs["content-targets"]["es-de-gamelists"].base,
      ...Object.values(
        paths.dirs["content-targets"]["es-de-gamelists"].consoles,
      ),
    ],
    files: Object.values(
      paths.files["content-targets"]["es-de-gamelists"].consoles,
    ),
  },
});

export default buildEsDeGamelistsListPaths;
