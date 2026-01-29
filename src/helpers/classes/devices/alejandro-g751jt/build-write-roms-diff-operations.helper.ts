import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteRomsDiffOperation } from "../../../../interfaces/write-roms-diff-operation.interface.js";
import type { Consoles } from "../../../../types/consoles.type.js";

const buildWriteRomsDiffOperations = (
  paths: AlejandroG751JTPaths["files"]["project"],
  consoles: Consoles,
): WriteRomsDiffOperation[] => {
  const ops: WriteRomsDiffOperation[] = [];

  for (const [, konsole] of consoles) {
    if (!konsole.metadata.canDiffRoms()) continue;

    const projectConsoleListRomsFile = paths.lists.roms.consoles[konsole.name];
    const projectConsoleDiffRomsFile = paths.diffs.roms.consoles[konsole.name];
    if (!projectConsoleListRomsFile || !projectConsoleDiffRomsFile) continue;

    ops.push({
      paths: {
        project: {
          list: {
            file: projectConsoleListRomsFile,
          },
          diff: {
            file: projectConsoleDiffRomsFile,
          },
        },
      },
      console: {
        name: konsole.name,
        roms: {
          all: konsole.games.allRoms,
          selected: konsole.games.selectedRoms,
        },
      },
    });
  }

  return ops;
};

export default buildWriteRomsDiffOperations;
