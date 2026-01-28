import databasePaths from "../../../../objects/database-paths.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { ConsolesMedias } from "../../../../types/consoles-medias.type.js";
import type { MediaEntry } from "../../../../types/media-entry.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import ls from "../../../extras/fs/ls.helper.js";

const fsExtras = {
  ls,
};

export interface ConsoleMediaName {
  console: ConsoleName;
  media: MediaName;
}

const populateConsolesMedias = async (
  consolesMedias: ConsolesMedias,
): Promise<ConsoleMediaName[]> => {
  const consoleMediaNamesToSkip: ConsoleMediaName[] = [];

  for (const [consoleName, consoleMedias] of consolesMedias.entries()) {
    for (const [mediaName, basenameMediaEntries] of consoleMedias.entries()) {
      const dbPath = databasePaths.getConsoleMediaNamesDatabaseDirPath(
        consoleName,
        mediaName,
      );

      const [lsEntries, lsError] = await fsExtras.ls(dbPath);

      if (lsError) {
        consoleMediaNamesToSkip.push({
          console: consoleName,
          media: mediaName,
        });
        continue;
      }

      for (const lsEntry of lsEntries) {
        if (lsEntry.is.link) continue;

        const filename = lsEntry.name;
        const lastDotIndex = filename.lastIndexOf(".");
        const basename =
          lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
        const extension =
          lastDotIndex === -1 ? "" : filename.substring(lastDotIndex + 1);

        const mediaEntryType: MediaEntry["type"] = lsEntry.is.file
          ? "file"
          : lsEntry.is.dir
            ? "dir"
            : "file";

        let newMediaEntry: MediaEntry;

        switch (mediaEntryType) {
          case "file":
            newMediaEntry = { type: "file", file: { type: extension } };
            break;
          case "dir":
            newMediaEntry = { type: "dir" };
            break;
        }

        const mediaEntries = basenameMediaEntries.get(basename);

        if (!mediaEntries) basenameMediaEntries.set(basename, [newMediaEntry]);
        else mediaEntries.push(newMediaEntry);
      }
    }
  }

  return consoleMediaNamesToSkip;
};

export default populateConsolesMedias;
