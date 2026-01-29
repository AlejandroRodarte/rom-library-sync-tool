import databasePaths from "../../../../objects/database-paths.object.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import type { MediaEntry } from "../../../../types/media-entry.type.js";
import ls from "../../../extras/fs/ls.helper.js";

const fsExtras = {
  ls,
};

const populateConsolesMedias = async (consoles: Consoles): Promise<void> => {
  for (const [, konsole] of consoles) {
    for (const mediaName of konsole.metadata.mediaNames) {
      const dbPath = databasePaths.getConsoleMediaNamesDatabaseDirPath(
        konsole.name,
        mediaName,
      );

      const [lsEntries, lsError] = await fsExtras.ls(dbPath);

      if (lsError) {
        konsole.metadata.skipGlobalMediaName(mediaName);
        continue;
      }

      const basenameMediaEntries = new Map<string, MediaEntry[]>();

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

      konsole.medias.set(mediaName, basenameMediaEntries);
    }
  }
};

export default populateConsolesMedias;
