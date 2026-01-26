import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ListPaths } from "../../../../interfaces/list-paths.interface.js";

const buildRomsListPaths = (paths: AlejandroG751JTPaths): ListPaths => ({
  project: {
    dirs: [
      paths.dirs.project.base,
      paths.dirs.project.lists.base,
      paths.dirs.project.lists["content-targets"].roms,
    ],
  },
  device: {
    dirs: [
      paths.dirs["content-targets"].roms.base,
      ...Object.values(paths.dirs["content-targets"].roms.consoles),
    ],
  },
});

export default buildRomsListPaths;
