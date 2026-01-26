import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { DiffPaths } from "../../../../interfaces/diff-paths.interface.js";

const buildMediaDiffPaths = (paths: AlejandroG751JTPaths): DiffPaths => {
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
