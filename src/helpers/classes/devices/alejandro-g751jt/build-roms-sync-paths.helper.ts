import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { SyncPaths } from "../../../../interfaces/sync-paths.interface.js";

const buildRomsSyncPaths = (paths: AlejandroG751JTPaths): SyncPaths => ({
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
