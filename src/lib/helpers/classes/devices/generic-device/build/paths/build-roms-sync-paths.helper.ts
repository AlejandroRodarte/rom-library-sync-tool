import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { SyncPaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/sync-paths.interface.js";

const buildRomsSyncPaths = (paths: GenericDevicePaths): SyncPaths => ({
  project: {
    diff: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.diffs.base,
        paths.dirs.project.diffs["content-targets"].roms,
      ],
      files: Object.values(paths.files.project.diffs.roms.consoles),
    },
    failed: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.failed.base,
        paths.dirs.project.failed["content-targets"].roms,
      ],
      files: Object.values(paths.files.project.failed.roms.consoles),
    },
  },
  device: {
    dirs: [
      paths.dirs["content-targets"].roms.base,
      ...Object.values(paths.dirs["content-targets"].roms.consoles),
    ],
  },
});

export default buildRomsSyncPaths;
