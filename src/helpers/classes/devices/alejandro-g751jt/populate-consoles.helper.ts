import databasePaths from "../../../../objects/database-paths.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import titlesFromRomsDirPath from "../../../build/titles-from-roms-dir-path.helper.js";
import dirExists, {
  type DirExistsError,
} from "../../../extras/fs/dir-exists.helper.js";
import type { ExistsFalseResult } from "../../../extras/fs/exists.helper.js";

const fsExtras = {
  dirExists,
};

const build = {
  titlesFromRomsDirPath,
};

export type PopulateConsolesError = DirExistsError | ExistsFalseResult["error"];

const populateConsoles = async (consoles: Consoles): Promise<ConsoleName[]> => {
  const consolesToSkip: ConsoleName[] = [];

  for (const [consoleName, konsole] of consoles) {
    const consoleDatabaseRomDirPath =
      databasePaths.getConsoleRomsDatabaseDirPath(consoleName);

    const [dbPathExistsResult, dbPathExistsError] = await fsExtras.dirExists(
      consoleDatabaseRomDirPath,
      "r",
    );

    if (dbPathExistsError) {
      consolesToSkip.push(consoleName);
      continue;
    }

    if (!dbPathExistsResult.exists) {
      consolesToSkip.push(consoleName);
      continue;
    }

    const [titles, buildTitlesError] = await build.titlesFromRomsDirPath(
      consoleDatabaseRomDirPath,
    );

    if (buildTitlesError) {
      consolesToSkip.push(consoleName);
      continue;
    }

    for (const [titleName, title] of titles) konsole.addTitle(titleName, title);
  }

  return consolesToSkip;
};

export default populateConsoles;
