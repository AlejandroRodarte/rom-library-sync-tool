import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";

const buildWriteConsoleMediaNameListOperations = (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
): WriteConsoleMediaNameListOperation[] => {
  const ops: WriteConsoleMediaNameListOperation[] = [];

  for (const [, consoleData] of Object.entries(consolesData)) {
    const deviceConsoleMediaDirPaths =
      paths.dirs["content-targets"].media.consoles[consoleData.name];

    const projectConsoleMediaFilePaths =
      paths.files.project.lists.media.consoles[consoleData.name];

    if (!deviceConsoleMediaDirPaths || !projectConsoleMediaFilePaths) continue;

    for (const mediaName of consoleData["content-targets"].media.names) {
      const deviceConsoleMediaNameDir =
        deviceConsoleMediaDirPaths.names[mediaName];
      if (!deviceConsoleMediaNameDir) continue;

      const projectConsoleMediaNameFile =
        projectConsoleMediaFilePaths[mediaName];
      if (!projectConsoleMediaNameFile) continue;

      ops.push({
        paths: {
          device: { dir: deviceConsoleMediaNameDir },
          project: { file: projectConsoleMediaNameFile },
        },
        names: { console: consoleData.name, media: mediaName },
      });
    }
  }

  return ops;
};

export default buildWriteConsoleMediaNameListOperations;
