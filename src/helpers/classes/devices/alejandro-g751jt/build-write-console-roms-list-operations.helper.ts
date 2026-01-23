import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteConsoleRomsListOperation } from "../../../../interfaces/write-console-roms-list-operation.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";

const buildWriteConsoleRomsListOperations = (
  paths: AlejandroG751JTPaths,
  consoleNames: ConsoleName[],
): WriteConsoleRomsListOperation[] => {
  const ops: WriteConsoleRomsListOperation[] = [];

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

export default buildWriteConsoleRomsListOperations;
