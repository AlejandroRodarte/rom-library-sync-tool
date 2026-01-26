import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteRomsDiffOperation } from "../../../../interfaces/write-roms-diff-operation.interface.js";
import type { DiffConsolesData } from "../../../../types/diff-consoles-data.type.js";

const buildWriteRomsDiffOperations = (
  paths: AlejandroG751JTPaths["files"]["project"],
  diffConsolesData: DiffConsolesData,
): WriteRomsDiffOperation[] => {
  const ops: WriteRomsDiffOperation[] = [];

  for (const [, diffConsoleData] of Object.entries(diffConsolesData)) {
    const consoleData = diffConsoleData.data;

    if (
      consoleData.skipFlags.global ||
      consoleData.skipFlags.diff.global ||
      consoleData.skipFlags.diff["content-targets"].roms
    )
      continue;

    const projectConsoleListRomsFile =
      paths.lists.roms.consoles[diffConsoleData.name];
    const projectConsoleDiffRomsFile =
      paths.diffs.roms.consoles[diffConsoleData.name];

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
        name: diffConsoleData.name,
        roms: {
          all: diffConsoleData.roms.all,
          selected: diffConsoleData.roms.selected,
        },
      },
    });
  }

  return ops;
};

export default buildWriteRomsDiffOperations;
