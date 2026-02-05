import { DIR, FILE } from "../../../../../constants/fs/fs-types.constants.js";
import { READ } from "../../../../../constants/rights/rights.constants.js";
import databasePaths from "../../../../../objects/database-paths.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import type { BasenameMediaEntries } from "../../../../../types/media/basename-media-entries.type.js";
import type { MediaEntry } from "../../../../../types/media/media-entry.type.js";
import dirExists from "../../../../extras/fs/dir-exists.helper.js";
import ls from "../../../../extras/fs/ls.helper.js";

const fsExtras = {
  ls,
  dirExists,
};

const populateConsolesMedias = async (consoles: Consoles): Promise<void> => {
  for (const [, konsole] of consoles) {
    for (const mediaName of konsole.metadata.mediaNames) {
      const dbPath = databasePaths.getConsoleMediaNamesDatabaseDirPath(
        konsole.name,
        mediaName,
      );

      const [dirExistsResult, dirExistsError] = await fsExtras.dirExists(
        dbPath,
        READ,
      );

      if (dirExistsError) {
        konsole.metadata.skipGlobalMediaName(mediaName);
        continue;
      }

      if (!dirExistsResult.exists) {
        konsole.metadata.skipGlobalMediaName(mediaName);
        continue;
      }

      const [lsEntries, lsError] = await fsExtras.ls(dbPath);

      if (lsError) {
        konsole.metadata.skipGlobalMediaName(mediaName);
        continue;
      }

      const basenameMediaEntries: BasenameMediaEntries = new Map<
        string,
        MediaEntry[]
      >();

      for (const lsEntry of lsEntries) {
        if (lsEntry.is.link) continue;

        const filename = lsEntry.name;
        const lastDotIndex = filename.lastIndexOf(".");
        const basename =
          lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
        const extension =
          lastDotIndex === -1 ? "" : filename.substring(lastDotIndex + 1);

        const mediaEntryType: MediaEntry["type"] = lsEntry.is.file
          ? FILE
          : lsEntry.is.dir
            ? DIR
            : FILE;

        let newMediaEntry: MediaEntry;

        switch (mediaEntryType) {
          case FILE:
            newMediaEntry = { type: FILE, file: { type: extension } };
            break;
          case DIR:
            newMediaEntry = { type: DIR };
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
