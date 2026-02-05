import { READ } from "../../../../../constants/rights/rights.constants.js";
import databasePaths from "../../../../../objects/database-paths.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import dirExists from "../../../../extras/fs/dir-exists.helper.js";
import buildTitleNameUsingOnlyRomFilename from "../build/titles/build-title-name-only-using-rom-filename.helper.js";
import buildTitlesFromRomsDirPath from "../build/titles/build-titles-from-roms-dir-path.helper.js";

const fsExtras = {
  dirExists,
};

const populateConsolesGames = async (consoles: Consoles): Promise<void> => {
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

    const [titles, buildTitlesError] = await buildTitlesFromRomsDirPath(
      consoleDatabaseRomDirPath,
      buildTitleNameUsingOnlyRomFilename,
    );

    if (buildTitlesError) {
      konsole.metadata.skipGlobal();
      continue;
    }

    for (const [, title] of titles) konsole.games.addTitle(title);
  }
};

export default populateConsolesGames;
