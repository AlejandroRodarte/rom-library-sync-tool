import type { GenericDevicePaths } from "../../../../interfaces/devices/generic-device/generic-device-paths.interface.js";
import type { DiffPaths } from "../../../../interfaces/diff-paths.interface.js";

const buildEsDeGamelistsDiffPaths = (paths: GenericDevicePaths): DiffPaths => ({
  project: {
    list: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.lists.base,
        paths.dirs.project.lists["content-targets"]["es-de-gamelists"],
      ],
      files: Object.values(
        paths.files.project.lists["es-de-gamelists"].consoles,
      ),
    },
    diff: {
      dirs: [
        paths.dirs.project.base,
        paths.dirs.project.diffs.base,
        paths.dirs.project.diffs["content-targets"]["es-de-gamelists"],
      ],
    },
  },
});

export default buildEsDeGamelistsDiffPaths;
