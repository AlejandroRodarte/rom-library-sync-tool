import type { WriteMediaNameListOperation } from "../../../../../../interfaces/classes/devices/generic-device/operations/write-media-name-list-operation.interface.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { Consoles } from "../../../../../../types/consoles/consoles.type.js";

const buildWriteMediaNameListOperations = (
  paths: GenericDevicePaths,
  consoles: Consoles,
): WriteMediaNameListOperation[] => {
  const ops: WriteMediaNameListOperation[] = [];

  for (const [, konsole] of consoles) {
    const deviceConsoleMediaDirPaths =
      paths.dirs["content-targets"].media.consoles[konsole.name];
    const projectConsoleMediaFilePaths =
      paths.files.project.lists.media.consoles[konsole.name];

    if (!deviceConsoleMediaDirPaths || !projectConsoleMediaFilePaths) continue;

    for (const mediaName of konsole.metadata.mediaNames) {
      if (!konsole.metadata.canListMediaName(mediaName)) continue;

      const deviceConsoleMediaNameDir =
        deviceConsoleMediaDirPaths.names[mediaName];
      const projectConsoleMediaNameFile =
        projectConsoleMediaFilePaths[mediaName];
      if (!deviceConsoleMediaNameDir || !projectConsoleMediaNameFile) continue;

      ops.push({
        paths: {
          device: { dir: deviceConsoleMediaNameDir },
          project: { file: projectConsoleMediaNameFile },
        },
        names: { console: konsole.name, media: mediaName },
      });
    }
  }

  return ops;
};

export default buildWriteMediaNameListOperations;
