import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteRomsListOperation } from "../../../../interfaces/write-roms-list-operation.interface.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";

const buildWriteRomsListOperations = (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
): WriteRomsListOperation[] => {
  const ops: WriteRomsListOperation[] = [];

  for (const [, consoleData] of Object.entries(consolesData)) {
    if (
      consoleData.skipFlags.global ||
      consoleData.skipFlags.list.global ||
      consoleData.skipFlags.list["content-targets"].roms
    )
      continue;

    const deviceConsoleRomsDir =
      paths.dirs["content-targets"].roms.consoles[consoleData.name];

    const projectConsolesRomsFile =
      paths.files.project.lists.roms.consoles[consoleData.name];

    if (!deviceConsoleRomsDir || !projectConsolesRomsFile) continue;

    ops.push({
      paths: {
        device: { dir: deviceConsoleRomsDir },
        project: { file: projectConsolesRomsFile },
      },
      names: { console: consoleData.name },
    });
  }

  return ops;
};

export default buildWriteRomsListOperations;
