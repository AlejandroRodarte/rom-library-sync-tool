import type { WriteMediaNameDiffOperation } from "../../../../../../interfaces/classes/devices/generic-device/operations/write-media-name-diff-operation.interface.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { Consoles } from "../../../../../../types/consoles/consoles.type.js";

const buildWriteMediaNameDiffOperations = (
  paths: GenericDevicePaths,
  consoles: Consoles,
): WriteMediaNameDiffOperation[] => {
  const ops: WriteMediaNameDiffOperation[] = [];

  for (const [, konsole] of consoles) {
    const projectConsoleMediaListFilePaths =
      paths.files.project.lists.media.consoles[konsole.name];
    const projectConsoleMediaDiffFilePaths =
      paths.files.project.diffs.media.consoles[konsole.name];
    if (!projectConsoleMediaListFilePaths || !projectConsoleMediaDiffFilePaths)
      continue;

    for (const [mediaName, basenameMediaEntries] of konsole.medias) {
      if (!konsole.metadata.canDiffMediaName(mediaName)) continue;

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
        console: {
          name: konsole.name,
          roms: {
            all: konsole.games.allRoms,
            selected: konsole.games.selectedRoms,
          },
        },
        media: {
          name: mediaName,
          entries: basenameMediaEntries,
        },
      });
    }
  }

  return ops;
};

export default buildWriteMediaNameDiffOperations;
