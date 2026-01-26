import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { DiffPaths } from "../../../../interfaces/diff-paths.interface.js";

const buildRomsDiffsDirPaths = (paths: AlejandroG751JTPaths): DiffPaths => ({
  project: {
    list: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.lists.base,
        paths.dirs.project.lists["content-targets"].roms,
      ],
      files: Object.values(paths.files.project.lists.roms.consoles),
    },
    diff: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.diffs.base,
        paths.dirs.project.diffs["content-targets"].roms,
      ],
    },
  },
});

export default buildRomsDiffsDirPaths;
