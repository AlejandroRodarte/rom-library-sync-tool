import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { SyncPaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/sync-paths.interface.js";

const buildEsDeGamelistsSyncPaths = (paths: GenericDevicePaths): SyncPaths => ({
  project: {
    diff: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.diffs.base,
        paths.dirs.project.diffs["content-targets"]["es-de-gamelists"],
      ],
      files: Object.values(
        paths.files.project.diffs["es-de-gamelists"].consoles,
      ),
    },
    failed: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.failed.base,
        paths.dirs.project.failed["content-targets"]["es-de-gamelists"],
      ],
      files: Object.values(
        paths.files.project.failed["es-de-gamelists"].consoles,
      ),
    },
  },
  device: {
    dirs: [
      paths.dirs["content-targets"]["es-de-gamelists"].base,
      ...Object.values(
        paths.dirs["content-targets"]["es-de-gamelists"].consoles,
      ),
    ],
  },
});

export default buildEsDeGamelistsSyncPaths;
