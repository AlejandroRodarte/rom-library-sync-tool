import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteMediaNameListOperation } from "../../../../interfaces/write-media-name-list-operation.interface.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";

const buildWriteMediaNameListOperations = (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
): WriteMediaNameListOperation[] => {
  const ops: WriteMediaNameListOperation[] = [];

  for (const [, consoleData] of Object.entries(consolesData)) {
    const deviceConsoleMediaDirPaths =
      paths.dirs["content-targets"].media.consoles[consoleData.name];

    const projectConsoleMediaFilePaths =
      paths.files.project.lists.media.consoles[consoleData.name];

    if (!deviceConsoleMediaDirPaths || !projectConsoleMediaFilePaths) continue;

    for (const mediaName of consoleData["content-targets"].media.names) {
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
        names: { console: consoleData.name, media: mediaName },
      });
    }
  }

  return ops;
};

export default buildWriteMediaNameListOperations;
