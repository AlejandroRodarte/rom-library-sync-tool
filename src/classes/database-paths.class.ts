import path from "node:path";
import CONSOLE_NAMES from "../constants/console-names.constant.js";
import type { DatabasePaths as IDatabasePaths } from "../interfaces/database-paths.interface.js";
import environment from "../objects/environment.object.js";
import type { ConsolePaths } from "../types/console-paths.types.js";
import MEDIA_NAMES from "../constants/media-names.constant.js";
import type { ConsoleContent } from "../types/console-content.type.js";
import type { MediaPaths } from "../types/media-paths.type.js";
import type { ConsoleName } from "../types/console-name.type.js";

class DatabasePaths {
  private _paths: IDatabasePaths;

  constructor() {
    this._paths = this._initDatabasePaths();
  }

  get allDirs(): string[] {
    const basePaths = [
      this._paths.dirs.roms.base,
      this._paths.dirs.media.base,
      this._paths.dirs.metadata.base,
    ];

    const romsPaths: string[] = [];
    const mediaPaths: string[] = [];
    const metadataPaths: string[] = [];

    for (const consoleName of CONSOLE_NAMES) {
      romsPaths.push(this._paths.dirs.roms.consoles[consoleName]);
      metadataPaths.push(this._paths.dirs.metadata.consoles[consoleName]);

      for (const mediaName of MEDIA_NAMES)
        mediaPaths.push(
          this._paths.dirs.media.consoles[consoleName][mediaName],
        );
    }

    return [...basePaths, ...mediaPaths, ...metadataPaths];
  }

  get allFiles(): string[] {
    const paths: string[] = [];

    for (const consoleName of CONSOLE_NAMES)
      paths.push(this._paths.files.metadata.consoles[consoleName]);

    return paths;
  }

  public getConsoleDatabaseRomDirPath(consoleName: ConsoleName): string {
    return this._paths.dirs.roms.consoles[consoleName];
  }

  private _initDatabasePaths(): IDatabasePaths {
    const paths = {
      dirs: {
        roms: {
          base: environment.paths.db.roms,
          consoles: Object.fromEntries(
            CONSOLE_NAMES.map((c) => [
              c,
              path.join(environment.paths.db.roms, c),
            ]),
          ) as ConsolePaths,
        },
        media: {
          base: environment.paths.db.media,
          consoles: Object.fromEntries(
            CONSOLE_NAMES.map((c) => [
              c,
              Object.fromEntries(
                MEDIA_NAMES.map((m) => [
                  m,
                  path.join(environment.paths.db.media, c, m),
                ]),
              ),
            ]),
          ) as ConsoleContent<MediaPaths>,
        },
        metadata: {
          base: environment.paths.db.metadata,
          consoles: Object.fromEntries(
            CONSOLE_NAMES.map((c) => [
              c,
              path.join(environment.paths.db.metadata, c),
            ]),
          ) as ConsolePaths,
        },
      },
      files: {
        metadata: {
          consoles: Object.fromEntries(
            CONSOLE_NAMES.map((c) => [
              c,
              path.join(environment.paths.db.metadata, c, "gamelist.xml"),
            ]),
          ) as ConsolePaths,
        },
      },
    };

    return paths;
  }
}

export default DatabasePaths;
