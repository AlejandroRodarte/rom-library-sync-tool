import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteMediaNameDiffOperation } from "../../../../interfaces/write-media-name-diff-operation.interface.js";
import type { ConsoleRoms } from "../../../../types/console-roms.type.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";

const buildWriteMediaNameDiffOperations = (
  paths: AlejandroG751JTPaths,
  consoles: ConsoleRoms,
  consolesData: ConsolesData,
): WriteMediaNameDiffOperation[] => {
  const ops: WriteMediaNameDiffOperation[] = [];

  for (const [, konsole] of Object.entries(consoles)) {
    const consoleData = consolesData[konsole.name];

    const projectConsoleMediaListFilePaths =
      paths.files.project.lists.media.consoles[konsole.name];

    const projectConsoleMediaDiffFilePaths =
      paths.files.project.diffs.media.consoles[konsole.name];

    if (
      !consoleData ||
      !projectConsoleMediaListFilePaths ||
      !projectConsoleMediaDiffFilePaths
    )
      continue;

    for (const mediaName of consoleData["content-targets"].media.names) {
      const projectConsoleMediaNameListFilePath =
        projectConsoleMediaListFilePaths[mediaName];
      const projectConsoleMediaNameDiffFilePath =
        projectConsoleMediaDiffFilePaths[mediaName];

      if (
        !projectConsoleMediaNameListFilePath ||
        !projectConsoleMediaNameDiffFilePath
      )
        continue;

      ops.push({
        paths: {
          project: {
            list: {
              file: projectConsoleMediaNameListFilePath,
            },
            diff: {
              file: projectConsoleMediaNameDiffFilePath,
            },
          },
        },
        console: konsole,
        media: {
          name: mediaName,
        },
      });
    }
  }

  return ops;
};

export default buildWriteMediaNameDiffOperations;
