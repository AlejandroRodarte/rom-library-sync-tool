import type { DiffPaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/diff-paths.interface.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";

const buildMediaDiffPaths = (paths: GenericDevicePaths): DiffPaths => {
  const listFilePaths: string[] = [];
  for (const [, consoleMediaPaths] of Object.entries(
    paths.files.project.lists.media.consoles,
  ))
    listFilePaths.push(...Object.values(consoleMediaPaths));

  return {
    project: {
      list: {
        dirs: [
          paths.dirs.project.base,
          paths.dirs.project.lists.base,
          paths.dirs.project.lists["content-targets"].media.base,
          ...Object.values(
            paths.dirs.project.lists["content-targets"].media.names,
          ),
        ],
        files: listFilePaths,
      },
      diff: {
        dirs: [
          paths.dirs.project.base,
          paths.dirs.project.diffs.base,
          paths.dirs.project.diffs["content-targets"].media.base,
          ...Object.values(
            paths.dirs.project.diffs["content-targets"].media.names,
          ),
        ],
      },
    },
  };
};

export default buildMediaDiffPaths;
