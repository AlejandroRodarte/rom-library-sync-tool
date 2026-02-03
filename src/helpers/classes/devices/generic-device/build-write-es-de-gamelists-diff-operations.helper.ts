import type { GenericDevicePaths } from "../../../../interfaces/devices/generic-device/generic-device-paths.interface.js";
import type { WriteEsDeGamelistsDiffOperation } from "../../../../interfaces/write-es-de-gamelists-diff-operation.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";

const buildWriteEsDeGamelistsDiffOperations = (
  paths: GenericDevicePaths,
  consoles: Consoles,
): WriteEsDeGamelistsDiffOperation[] => {
  const ops: WriteEsDeGamelistsDiffOperation[] = [];

  for (const [, konsole] of consoles) {
    if (!konsole.metadata.canDiffEsDeGamelist()) continue;

    const projectConsoleEsDeGamelistListFilePath =
      paths.files.project.lists["es-de-gamelists"].consoles[konsole.name];
    const projectConsoleEsDeGamelistDiffFilePath =
      paths.files.project.diffs["es-de-gamelists"].consoles[konsole.name];

    if (
      !projectConsoleEsDeGamelistListFilePath ||
      !projectConsoleEsDeGamelistDiffFilePath
    )
      continue;

    ops.push({
      paths: {
        project: {
          list: {
            file: projectConsoleEsDeGamelistListFilePath,
          },
          diff: {
            file: projectConsoleEsDeGamelistDiffFilePath,
          },
        },
      },
      console: {
        name: konsole.name,
        gamelist: konsole.gamelist,
      },
    });
  }

  return ops;
};

export default buildWriteEsDeGamelistsDiffOperations;
