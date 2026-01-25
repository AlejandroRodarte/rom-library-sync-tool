import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteRomsListOperation } from "../../../../interfaces/write-roms-list-operation.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";

const buildWriteRomsListOperations = (
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
): WriteRomsListOperation[] => {
  const ops: WriteRomsListOperation[] = [];

  for (const consoleName of consoleNames) {
    const deviceConsoleRomsDir =
      paths.dirs["content-targets"].roms.consoles[consoleName];

    const projectConsolesRomsFile =
      paths.files.project.lists.roms.consoles[consoleName];

    if (!deviceConsoleRomsDir || !projectConsolesRomsFile) continue;

    ops.push({
      paths: {
        device: { dir: deviceConsoleRomsDir },
        project: { file: projectConsolesRomsFile },
      },
      names: { console: consoleName },
    });
  }

  return ops;
};

export default buildWriteRomsListOperations;
