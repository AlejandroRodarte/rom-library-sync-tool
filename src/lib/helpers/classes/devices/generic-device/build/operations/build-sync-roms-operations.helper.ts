import type { SyncRomsOperation } from "../../../../../../interfaces/classes/devices/generic-device/operations/sync-roms-operation.interface.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import databasePaths from "../../../../../../objects/database-paths.object.js";
import type { Consoles } from "../../../../../../types/consoles/consoles.type.js";

const buildSyncRomsOperations = (
  paths: GenericDevicePaths,
  consoles: Consoles,
): SyncRomsOperation[] => {
  const ops: SyncRomsOperation[] = [];

  for (const [, konsole] of consoles) {
    if (!konsole.metadata.canSyncRoms()) continue;

    const projectConsoleDiffRomsFilePath =
      paths.files.project.diffs.roms.consoles[konsole.name];
    const projectConsoleFailedRomsFilePath =
      paths.files.project.failed.roms.consoles[konsole.name];
    const deviceConsoleDirPath =
      paths.dirs["content-targets"].roms.consoles[konsole.name];

    if (
      !projectConsoleDiffRomsFilePath ||
      !projectConsoleFailedRomsFilePath ||
      !deviceConsoleDirPath
    )
      continue;

    const dbConsoleDirPath = databasePaths.getConsoleRomsDatabaseDirPath(
      konsole.name,
    );

    ops.push({
      paths: {
        project: {
          diff: {
            file: projectConsoleDiffRomsFilePath,
          },
          failed: {
            file: projectConsoleFailedRomsFilePath,
          },
        },
        device: {
          dir: deviceConsoleDirPath,
        },
        db: {
          dir: dbConsoleDirPath,
        },
      },
      console: {
        name: konsole.name,
      },
    });
  }

  return ops;
};

export default buildSyncRomsOperations;
