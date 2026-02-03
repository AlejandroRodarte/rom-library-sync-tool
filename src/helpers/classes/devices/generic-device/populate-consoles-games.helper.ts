import databasePaths from "../../../../objects/database-paths.object.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import titlesFromRomsDirPath from "../../../build/titles-from-roms-dir-path.helper.js";
import dirExists from "../../../extras/fs/dir-exists.helper.js";

const fsExtras = {
  dirExists,
};

const build = {
  titlesFromRomsDirPath,
};

const populateConsolesGames = async (consoles: Consoles): Promise<void> => {
  for (const [consoleName, konsole] of consoles) {
    const consoleDatabaseRomDirPath =
      databasePaths.getConsoleRomsDatabaseDirPath(consoleName);

    const [dbPathExistsResult, dbPathExistsError] = await fsExtras.dirExists(
      consoleDatabaseRomDirPath,
      "r",
    );

    if (dbPathExistsError) {
      konsole.metadata.skipGlobal();
      continue;
    }

    if (!dbPathExistsResult.exists) {
      konsole.metadata.skipGlobal();
      continue;
    }

    const [titles, buildTitlesError] = await build.titlesFromRomsDirPath(
      consoleDatabaseRomDirPath,
    );

    if (buildTitlesError) {
      konsole.metadata.skipGlobal();
      continue;
    }

    for (const [, title] of titles) konsole.games.addTitle(title);
  }
};

export default populateConsolesGames;
