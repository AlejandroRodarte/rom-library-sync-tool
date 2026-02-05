import type { SyncMediaOperation } from "../../../../../../interfaces/classes/devices/generic-device/operations/sync-media-operation.interface.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import databasePaths from "../../../../../../objects/database-paths.object.js";
import type { Consoles } from "../../../../../../types/consoles/consoles.type.js";

const buildSyncMediaOperations = (
  paths: GenericDevicePaths,
  consoles: Consoles,
): SyncMediaOperation[] => {
  const ops: SyncMediaOperation[] = [];

  for (const [, konsole] of consoles) {
    const projectConsoleMediaDiffFilePaths =
      paths.files.project.diffs.media.consoles[konsole.name];
    const projectConsoleMediaFailedFilePaths =
      paths.files.project.diffs.media.consoles[konsole.name];
    const deviceConsoleMediaDirPaths =
      paths.dirs["content-targets"].media.consoles[konsole.name];

    if (
      !projectConsoleMediaDiffFilePaths ||
      !projectConsoleMediaFailedFilePaths ||
      !deviceConsoleMediaDirPaths
    )
      continue;

    for (const mediaName of konsole.metadata.mediaNames) {
      if (!konsole.metadata.canSyncMediaName(mediaName)) continue;

      const projectConsoleMediaNameDiffFilePath =
        projectConsoleMediaDiffFilePaths[mediaName];
      const projectConsoleMediaNameFailedFilePath =
        projectConsoleMediaFailedFilePaths[mediaName];
      const deviceConsoleMediaNameDirPath =
        deviceConsoleMediaDirPaths.names[mediaName];

      if (
        !projectConsoleMediaNameDiffFilePath ||
        !projectConsoleMediaNameFailedFilePath ||
        !deviceConsoleMediaNameDirPath
      )
        continue;

      const dbConsoleMediaNameDirPath =
        databasePaths.getConsoleMediaNamesDatabaseDirPath(
          konsole.name,
          mediaName,
        );

      ops.push({
        paths: {
          project: {
            diff: {
              file: projectConsoleMediaNameDiffFilePath,
            },
            failed: {
              file: projectConsoleMediaNameFailedFilePath,
            },
          },
          device: {
            dir: deviceConsoleMediaNameDirPath,
          },
          db: {
            dir: dbConsoleMediaNameDirPath,
          },
        },
        console: {
          name: konsole.name,
        },
        media: {
          name: mediaName,
        },
      });
    }
  }

  return ops;
};

export default buildSyncMediaOperations;
