import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteEsDeGamelistsListOperation } from "../../../../interfaces/write-es-de-gamelists-list-operation.interface.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";

const buildWriteEsDeGamelistsListOperations = (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
): WriteEsDeGamelistsListOperation[] => {
  const ops: WriteEsDeGamelistsListOperation[] = [];

  for (const [, consoleData] of Object.entries(consolesData)) {
    if (
      consoleData.skipFlags.global ||
      consoleData.skipFlags.list.global ||
      consoleData.skipFlags.list["content-targets"]["es-de-gamelists"]
    )
      continue;

    const projectConsoleGamelistFile =
      paths.files.project.lists["es-de-gamelists"].consoles[consoleData.name];
    const deviceConsoleGamelistFile =
      paths.files["content-targets"]["es-de-gamelists"].consoles[
        consoleData.name
      ];

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
        console: consoleData.name,
      },
    });
  }

  return ops;
};

export default buildWriteEsDeGamelistsListOperations;
