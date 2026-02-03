import type { GenericDevicePaths } from "../../../../interfaces/devices/generic-device/generic-device-paths.interface.js";
import type { SyncPaths } from "../../../../interfaces/sync-paths.interface.js";

const buildMediaSyncPaths = (paths: GenericDevicePaths): SyncPaths => {
  const diffFiles: string[] = [];

  for (const consoleMediaDiffFiles of Object.values(
    paths.files.project.diffs.media.consoles,
  ))
    diffFiles.push(...Object.values(consoleMediaDiffFiles));

  const failedFiles: string[] = [];

  for (const consoleMediaFailedFiles of Object.values(
    paths.files.project.failed.media.consoles,
  ))
    failedFiles.push(...Object.values(consoleMediaFailedFiles));

  const deviceDirs: string[] = [paths.dirs["content-targets"].media.base];

  for (const deviceConsoleMediaDirs of Object.values(
    paths.dirs["content-targets"].media.consoles,
  ))
    deviceDirs.push(
      deviceConsoleMediaDirs.base,
      ...Object.values(deviceConsoleMediaDirs.names),
    );

  return {
    project: {
      diff: {
        dirs: [
          paths.dirs.project.base,
          paths.dirs.project.diffs.base,
          paths.dirs.project.diffs["content-targets"].media.base,
          ...Object.values(
            paths.dirs.project.diffs["content-targets"].media.names,
          ),
        ],
        files: diffFiles,
      },
      failed: {
        dirs: [
          paths.dirs.project.base,
          paths.dirs.project.failed.base,
          paths.dirs.project.failed["content-targets"].media.base,
          ...Object.values(
            paths.dirs.project.diffs["content-targets"].media.names,
          ),
        ],
        files: failedFiles,
      },
    },
    device: {
      dirs: deviceDirs,
    },
  };
};

export default buildMediaSyncPaths;
