import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteMediaNameDiffOperation } from "../../../../interfaces/write-media-name-diff-operation.interface.js";
import type { DiffConsolesData } from "../../../../types/diff-consoles-data.type.js";

const buildWriteMediaNameDiffOperations = (
  paths: AlejandroG751JTPaths,
  diffConsolesData: DiffConsolesData,
): WriteMediaNameDiffOperation[] => {
  const ops: WriteMediaNameDiffOperation[] = [];

  for (const [, diffConsoleData] of Object.entries(diffConsolesData)) {
    const projectConsoleMediaListFilePaths =
      paths.files.project.lists.media.consoles[diffConsoleData.name];

    const projectConsoleMediaDiffFilePaths =
      paths.files.project.diffs.media.consoles[diffConsoleData.name];

    if (!projectConsoleMediaListFilePaths || !projectConsoleMediaDiffFilePaths)
      continue;

    for (const mediaName of diffConsoleData.data["content-targets"].media
      .names) {
      if (
        diffConsoleData.data.skipFlags.global ||
        diffConsoleData.data.skipFlags.diff.global ||
        diffConsoleData.data.skipFlags.diff["content-targets"].media.global ||
        diffConsoleData.data.skipFlags.diff["content-targets"].media.names[
          mediaName
        ]
      )
        continue;

      const projectConsoleMediaNameListFilePath =
        projectConsoleMediaListFilePaths[mediaName];
      const projectConsoleMediaNameDiffFilePath =
        projectConsoleMediaDiffFilePaths[mediaName];

      const basenameMediaEntries = diffConsoleData.medias.get(mediaName);

      if (
        !projectConsoleMediaNameListFilePath ||
        !projectConsoleMediaNameDiffFilePath ||
        !basenameMediaEntries
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
          name: diffConsoleData.name,
          roms: {
            all: diffConsoleData.roms.all,
            selected: diffConsoleData.roms.selected,
          },
        },
        media: {
          name: mediaName,
          basename: {
            entries: basenameMediaEntries,
          },
        },
      });
    }
  }

  return ops;
};

export default buildWriteMediaNameDiffOperations;
