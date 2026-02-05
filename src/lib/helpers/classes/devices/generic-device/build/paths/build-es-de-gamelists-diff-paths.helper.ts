import type { DiffPaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/diff-paths.interface.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";

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
