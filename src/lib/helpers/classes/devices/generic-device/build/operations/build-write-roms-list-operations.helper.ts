import type { WriteRomsListOperation } from "../../../../../../interfaces/classes/devices/generic-device/operations/write-roms-list-operation.interface.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { Consoles } from "../../../../../../types/consoles/consoles.type.js";

const buildWriteRomsListOperations = (
  paths: GenericDevicePaths,
  consoles: Consoles,
): WriteRomsListOperation[] => {
  const ops: WriteRomsListOperation[] = [];

  for (const [, konsole] of consoles) {
    if (!konsole.metadata.canListRoms()) continue;

    const deviceConsoleRomsDir =
      paths.dirs["content-targets"].roms.consoles[konsole.name];
    const projectConsolesRomsFile =
      paths.files.project.lists.roms.consoles[konsole.name];

    if (!deviceConsoleRomsDir || !projectConsolesRomsFile) continue;

    ops.push({
      paths: {
        device: { dir: deviceConsoleRomsDir },
        project: { file: projectConsolesRomsFile },
      },
      names: { console: konsole.name },
    });
  }

  return ops;
};

export default buildWriteRomsListOperations;
