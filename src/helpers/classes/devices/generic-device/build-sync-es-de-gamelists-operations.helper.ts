import type { GenericDevicePaths } from "../../../../interfaces/devices/generic-device/generic-device-paths.interface.js";
import type { SyncEsDeGamelistsOperation } from "../../../../interfaces/sync-es-de-gamelists-operation.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";

const buildSyncEsDeGamelistsOperations = (
  paths: GenericDevicePaths,
  consoles: Consoles,
): SyncEsDeGamelistsOperation[] => {
  const ops: SyncEsDeGamelistsOperation[] = [];

  for (const [, konsole] of consoles) {
    if (!konsole.metadata.canSyncEsDeGamelist()) continue;

    const projectConsoleEsDeGamelistDiffFilePath =
      paths.files.project.diffs["es-de-gamelists"].consoles[konsole.name];
    const projectConsoleEsDeGamelistFailedFilePath =
      paths.files.project.failed["es-de-gamelists"].consoles[konsole.name];
    const deviceConsoleEsDeGamelistFilePath =
      paths.files["content-targets"]["es-de-gamelists"].consoles[konsole.name];

    if (
      !projectConsoleEsDeGamelistDiffFilePath ||
      !projectConsoleEsDeGamelistFailedFilePath ||
      !deviceConsoleEsDeGamelistFilePath
    )
      continue;

    ops.push({
      paths: {
        project: {
          diff: {
            file: projectConsoleEsDeGamelistDiffFilePath,
          },
          failed: {
            file: projectConsoleEsDeGamelistFailedFilePath,
          },
        },
        device: {
          file: deviceConsoleEsDeGamelistFilePath,
        },
      },
      console: {
        name: konsole.name,
      },
    });
  }

  return ops;
};

export default buildSyncEsDeGamelistsOperations;
