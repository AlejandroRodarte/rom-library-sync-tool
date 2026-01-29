import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteEsDeGamelistsListOperation } from "../../../../interfaces/write-es-de-gamelists-list-operation.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";

const buildWriteEsDeGamelistsListOperations = (
  paths: AlejandroG751JTPaths,
  consoles: Consoles,
): WriteEsDeGamelistsListOperation[] => {
  const ops: WriteEsDeGamelistsListOperation[] = [];

  for (const [, konsole] of consoles) {
    if (!konsole.metadata.canListEsDeGamelist()) continue;

    const projectConsoleGamelistFile =
      paths.files.project.lists["es-de-gamelists"].consoles[konsole.name];
    const deviceConsoleGamelistFile =
      paths.files["content-targets"]["es-de-gamelists"].consoles[konsole.name];
    if (!projectConsoleGamelistFile || !deviceConsoleGamelistFile) continue;

    ops.push({
      paths: {
        device: {
          file: deviceConsoleGamelistFile,
        },

        project: {
          file: projectConsoleGamelistFile,
        },
      },
      names: {
        console: konsole.name,
      },
    });
  }

  return ops;
};

export default buildWriteEsDeGamelistsListOperations;
