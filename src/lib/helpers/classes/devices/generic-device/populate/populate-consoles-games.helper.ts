import Roms from "../../../../../classes/entities/roms.class.js";
import Title from "../../../../../classes/entities/title.class.js";
import type AppConversionError from "../../../../../classes/errors/app-conversion-error.class.js";
import { DIR, FILE } from "../../../../../constants/fs/fs-types.constants.js";
import { READ } from "../../../../../constants/rights/rights.constants.js";
import type { Rom } from "../../../../../interfaces/roms/rom.interface.js";
import databasePaths from "../../../../../objects/database-paths.object.js";
import logger from "../../../../../objects/logger.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import type { RomTitleNameBuildStrategy } from "../../../../../types/roms/rom-title-name-build-strategy.type.js";
import buildRomLabelsAndLanguagesFromRomFilename from "../../../../build/roms/build-rom-labels-and-languages-from-rom-filename.helper.js";
import buildTitleNameUsingOnlyRomFilename from "../../../../build/titles/build-title-name-only-using-rom-filename.helper.js";
import buildTitleNameUsingEsDeGamelistName from "../../../../build/titles/build-title-name-using-es-de-gamelist-name.helper.js";
import dirExists from "../../../../extras/fs/dir-exists.helper.js";
import readdir from "../../../../wrappers/modules/fs/readdir.helper.js";

const fsExtras = {
  dirExists,
};

const populateConsolesGames = async (
  consoles: Consoles,
  titleNameBuildStratgy: RomTitleNameBuildStrategy,
): Promise<void> => {
  for (const [consoleName, konsole] of consoles) {
    const consoleDatabaseRomDirPath =
      databasePaths.getConsoleRomsDatabaseDirPath(consoleName);

    const [dbPathExistsResult, dbPathExistsError] = await fsExtras.dirExists(
      consoleDatabaseRomDirPath,
      READ,
    );

    if (dbPathExistsError) {
      konsole.metadata.skipGlobal();
      continue;
    }

    if (!dbPathExistsResult.exists) {
      konsole.metadata.skipGlobal();
      continue;
    }

    const [entries, readdirError] = await readdir(consoleDatabaseRomDirPath, {
      withFileTypes: true,
      encoding: "buffer",
    });

    if (readdirError) {
      konsole.metadata.skipGlobal();
      continue;
    }

    const filteredEntries = entries.filter(
      (e) =>
        e.name.toString() !== "systeminfo.txt" &&
        e.name.toString() !== "metadata.txt",
    );

    for (const entry of filteredEntries) {
      if (entry.isSymbolicLink()) {
        logger.warn(
          `Entry ${entry.name} is a symlink, which is not a valid ROM file type. Skipping entry.`,
        );
        continue;
      }

      const filename = entry.name.toString();
      const lastDotIndex = filename.lastIndexOf(".");

      if (entry.isFile() && lastDotIndex === -1) {
        logger.warn(
          `Entry ${entry.name} is a file, and does not have a dot that separates basename from extension. Skipping entry.`,
        );
        continue;
      }

      const basename =
        lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
      const extension = filename.substring(lastDotIndex + 1);

      const { labels, languages } =
        buildRomLabelsAndLanguagesFromRomFilename(filename);

      const newRom: Rom = {
        base: { name: basename },
        file: { name: filename, type: extension },
        fs: { type: entry.isFile() ? FILE : DIR },
        labels,
        languages,
      };

      let titleName: string | undefined;
      let conversionError: AppConversionError | undefined;

      switch (titleNameBuildStratgy) {
        case "rom-filename": {
          const [strategyTitleName, strategyConversionError] =
            buildTitleNameUsingOnlyRomFilename(entry);

          if (strategyConversionError) {
            conversionError = strategyConversionError;
            break;
          }

          titleName = strategyTitleName;
          break;
        }
        case "es-de-gamelist-name": {
          const [strategyTitleName, strategyConversionError] =
            buildTitleNameUsingEsDeGamelistName(entry, konsole.gamelist);

          if (strategyConversionError) {
            conversionError = strategyConversionError;
            break;
          }

          titleName = strategyTitleName;
          break;
        }
      }

      if (conversionError) continue;
      if (!titleName) continue;

      const title = konsole.games.getTitle(titleName);

      if (title) title.addRom(newRom);
      else {
        const newTitle = new Title(titleName, new Roms());
        newTitle.addRom(newRom);
        konsole.games.addTitle(newTitle);
      }
    }
  }
};

export default populateConsolesGames;
