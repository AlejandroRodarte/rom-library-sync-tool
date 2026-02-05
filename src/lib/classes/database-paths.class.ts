import path from "node:path";

import { type DatabasePaths as IDatabasePaths } from "../interfaces/paths/database-paths.interface.js";
import type { ConsoleName } from "../types/consoles/console-name.type.js";
import type { MediaName } from "../types/media/media-name.type.js";
import environment from "../objects/environment.object.js";
import ALL_CONSOLE_NAMES from "../constants/consoles/all-console-names.constant.js";
import type { ConsolePaths } from "../types/consoles/console-paths.types.js";
import ALL_MEDIA_NAMES from "../constants/media/all-media-names.constant.js";
import type { ConsoleContent } from "../types/consoles/console-content.type.js";
import type { MediaPaths } from "../types/media/media-paths.type.js";

class DatabasePaths {
  private _paths: IDatabasePaths;

  constructor() {
    this._paths = this._initDatabasePaths();
  }

  public getConsoleRomsDatabaseDirPath(consoleName: ConsoleName): string {
    return this._paths.dirs.roms.consoles[consoleName];
  }

  public getConsoleMediaNamesDatabaseDirPath(
    consoleName: ConsoleName,
    mediaName: MediaName,
  ): string {
    return this._paths.dirs.media.consoles[consoleName][mediaName];
  }

  public getConsoleEsDeGamelistDatabaseFilePath(
    consoleName: ConsoleName,
  ): string {
    return this._paths.files["es-de-gamelists"].consoles[consoleName];
  }

  private _initDatabasePaths(): IDatabasePaths {
    const paths: IDatabasePaths = {
      dirs: {
        roms: {
          base: environment.database.paths.roms,
          consoles: Object.fromEntries(
            ALL_CONSOLE_NAMES.map((c) => [
              c,
              path.join(environment.database.paths.roms, c),
            ]),
          ) as ConsolePaths,
        },
        media: {
          base: environment.database.paths.media,
          consoles: Object.fromEntries(
            ALL_CONSOLE_NAMES.map((c) => [
              c,
              Object.fromEntries(
                ALL_MEDIA_NAMES.map((m) => [
                  m,
                  path.join(environment.database.paths.media, c, m),
                ]),
              ),
            ]),
          ) as ConsoleContent<MediaPaths>,
        },
        "es-de-gamelists": {
          base: environment.database.paths["es-de-gamelists"],
          consoles: Object.fromEntries(
            ALL_CONSOLE_NAMES.map((c) => [
              c,
              path.join(environment.database.paths["es-de-gamelists"], c),
            ]),
          ) as ConsolePaths,
        },
      },
      files: {
        "es-de-gamelists": {
          consoles: Object.fromEntries(
            ALL_CONSOLE_NAMES.map((c) => [
              c,
              path.join(
                environment.database.paths["es-de-gamelists"],
                c,
                "gamelist.xml",
              ),
            ]),
          ) as ConsolePaths,
        },
      },
    };

    return paths;
  }
}

export default DatabasePaths;
