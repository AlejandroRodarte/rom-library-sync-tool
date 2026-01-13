import path from "node:path";

import devices from "../../helpers/devices/index.js";
import type { Device } from "../../interfaces/device.interface.js";
import environment from "../../objects/environment.object.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { Consoles } from "../../types/consoles.type.js";
import type { DeviceName } from "../../types/device-name.type.js";
import Console from "../console.class.js";
import AppEntryExistsError from "../errors/app-entry-exists-error.class.js";
import AppNotFoundError from "../errors/app-not-found-error.class.js";
import { DEVICES_DIR_PATH } from "../../constants/paths.constants.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import type { ConsolePaths } from "../../types/console-paths.types.js";
import type { SteamDeckPaths } from "../../interfaces/steam-deck-paths.interface.js";
import MEDIA_NAMES from "../../constants/media-names.constant.js";
import type { MediaPaths } from "../../types/media-paths.type.js";
import type { ConsoleContent } from "../../types/console-content.type.js";
import type { MediaContent } from "../../types/media-content.type.js";
import build from "../../helpers/build/index.js";
import logger from "../../objects/logger.object.js";
import unselect from "../../helpers/unselect/index.js";
import databasePaths from "../../objects/database-paths.object.js";
import type { SteamDeckConsolesSkipFlags } from "../../interfaces/steam-deck-consoles-skip-flags.interface.js";
import type { MediaName } from "../../types/media-name.type.js";
import type { DeviceWriteMethods } from "../../interfaces/device-write-methods.interface.js";
import fileIO from "../../helpers/file-io/index.js";

export type AddConsoleMethodError = AppNotFoundError | AppEntryExistsError;

const STEAM_DECK = "steam-deck" as const;

class SteamDeck implements Device {
  private _name: typeof STEAM_DECK = STEAM_DECK;

  private _paths: SteamDeckPaths;

  private _consoles: Consoles;
  private _consoleNames: ConsoleName[];

  private _consoleSkipFlags: ConsoleContent<SteamDeckConsolesSkipFlags> =
    Object.fromEntries(
      CONSOLE_NAMES.map((c) => [
        c,
        {
          global: false,
          filter: false,
          sync: {
            global: false,
            roms: false,
            media: {
              global: false,
              names: Object.fromEntries(
                MEDIA_NAMES.map((m) => [m, false]),
              ) as MediaContent<boolean>,
            },
            metadata: false,
          },
        },
      ]),
    ) as ConsoleContent<SteamDeckConsolesSkipFlags>;

  constructor(consoleNames: ConsoleName[]) {
    const uniqueConsoleNames = [...new Set(consoleNames)];
    this._consoleNames = uniqueConsoleNames;

    this._consoles = new Map<ConsoleName, Console>();
    for (const consoleName of this._consoleNames)
      this.addConsole(consoleName, new Console(consoleName));

    this._paths = this._initSteamDeckPaths();
  }

  name: () => DeviceName = () => {
    return this._name;
  };

  consoles: () => Consoles = () => {
    return this._consoles;
  };

  populate: () => Promise<void> = async () => {
    for (const [consoleName, konsole] of this._consoles) {
      const [titles, buildTitlesError] = await build.titlesFromRomsDirPath(
        databasePaths.getConsoleDatabaseRomDirPath(consoleName),
      );

      if (buildTitlesError) {
        logger.warn(
          `Error while reading database ROM directory for console ${consoleName}.\n${buildTitlesError.toString()}\nWill skip this console. This means that NOTHING after this step will get processed.`,
        );

        this._consoleSkipFlags[consoleName].global = true;
        this._consoleSkipFlags[consoleName].filter = true;
        this._consoleSkipFlags[consoleName].sync.global = true;

        continue;
      }

      for (const [titleName, title] of titles)
        konsole.addTitle(titleName, title);
    }
  };

  filter: () => void = () => {
    for (const [, konsole] of this._consoles)
      konsole.unselectTitles(unselect.bySteamDeckDevice);
  };

  update: () => void = () => {
    for (const [, konsole] of this._consoles) {
      konsole.updateSelectedRoms();
      konsole.updateScrappedTitles();
      konsole.updateScrappedTitles();
    }
  };

  sync: () => Promise<void> = async () => {
    await devices.syncSteamDeck(this);
  };

  write: DeviceWriteMethods = {
    duplicates: async () => {
      const writeError = await fileIO.writeDuplicateRomsFile(
        this.filterableConsoles,
        this._paths.files.fileIO.logs.duplicates,
      );
      if (writeError) logger.error(writeError.toString());
    },
    scrapped: async () => {
      const writeError = await fileIO.writeScrappedRomsFile(
        this.filterableConsoles,
        this._paths.files.fileIO.logs.scrapped,
      );
      if (writeError) logger.error(writeError.toString());
    },
    diffs: async () => {
      for (const [consoleName, konsole] of this.filterableConsoles) {
        const diffError = await fileIO.writeConsoleDiffFile(konsole, {
          list: this._paths.files.fileIO.lists.roms.consoles[consoleName],
          diff: this._paths.files.fileIO.diffs.roms.consoles[consoleName],
        });

        if (diffError) {
          logger.warn(
            `${diffError.toString()}\nSince we were not able to generate the diff file, we will skip this console when sync-ing.`,
          );
          this._consoleSkipFlags[consoleName].sync.roms = true;
        }
      }
    },
  };

  get filterableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter,
      ),
    );
  }

  get allSyncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter &&
          !this._consoleSkipFlags[consoleName].sync.global,
      ),
    );
  }

  get romsSyncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter &&
          !this._consoleSkipFlags[consoleName].sync.global &&
          !this._consoleSkipFlags[consoleName].sync.roms,
      ),
    );
  }

  get allMediaSyncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter &&
          !this._consoleSkipFlags[consoleName].sync.global &&
          !this._consoleSkipFlags[consoleName].sync.media.global,
      ),
    );
  }

  get metadataSyncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter &&
          !this._consoleSkipFlags[consoleName].sync.global &&
          !this._consoleSkipFlags[consoleName].sync.metadata,
      ),
    );
  }

  public getMediaNameSyncableConsoles(mediaName: MediaName): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter &&
          !this._consoleSkipFlags[consoleName].sync.global &&
          !this._consoleSkipFlags[consoleName].sync.media.global &&
          !this._consoleSkipFlags[consoleName].sync.media.names[mediaName],
      ),
    );
  }

  get allFailedFilePaths(): string[] {
    const romsFailedPaths = Object.entries(
      this._paths.files.fileIO.failed.roms.consoles,
    ).map(([, path]) => path);

    const mediaFailedPaths: string[] = [];

    for (const mediaName of MEDIA_NAMES)
      for (const consoleName of CONSOLE_NAMES)
        mediaFailedPaths.push(
          this._paths.files.fileIO.failed.media[mediaName][consoleName],
        );

    return [...romsFailedPaths, ...mediaFailedPaths];
  }

  get allSyncDirPaths(): string[] {
    const basePaths = [
      this._paths.dirs.sync.roms.base,
      this._paths.dirs.sync.media.base,
      this._paths.dirs.sync.metadata.base,
    ];

    const romsSyncPaths: string[] = [];
    const mediaSyncPaths: string[] = [];
    const metadataSyncPaths: string[] = [];

    for (const consoleName of CONSOLE_NAMES) {
      if (!this._consoleNames.includes(consoleName)) continue;

      basePaths.push(this._paths.dirs.sync.media.consoles[consoleName].base);

      romsSyncPaths.push(this._paths.dirs.sync.roms.consoles[consoleName]);
      metadataSyncPaths.push(
        this._paths.dirs.sync.metadata.consoles[consoleName],
      );

      for (const mediaName of MEDIA_NAMES) {
        // TODO: if (!this._mediaNames.includes(mediaName)) continue;
        // requires STEAM_DECK_MEDIAS_LIST environment variable
        mediaSyncPaths.push(
          this._paths.dirs.sync.media.consoles[consoleName].names[mediaName],
        );
      }
    }

    return [...basePaths, ...mediaSyncPaths, ...metadataSyncPaths];
  }

  public getConsoleRomsFailedFilePath(consoleName: ConsoleName): string {
    return this._paths.files.fileIO.failed.roms.consoles[consoleName];
  }

  public getConsoleRomsDiffFilePath(consoleName: ConsoleName): string {
    return this._paths.files.fileIO.diffs.roms.consoles[consoleName];
  }

  public getConsoleRomsSyncDirPath(consoleName: ConsoleName): string {
    return this._paths.dirs.sync.roms.consoles[consoleName];
  }

  public addConsole(
    consoleName: ConsoleName,
    konsole: Console,
  ): AddConsoleMethodError | undefined {
    if (!this._consoleNames.includes(consoleName))
      return new AppNotFoundError(
        `Device ${this._name} is NOT related to console ${consoleName}. This device supports the following consoles: ${this._consoleNames.join(", ")}.`,
      );

    const consoleExists = this._consoles.has(consoleName);
    if (consoleExists)
      return new AppEntryExistsError(
        `There is already an entry for console ${consoleName}.`,
      );

    this._consoles.set(consoleName, konsole);
  }

  private _initSteamDeckPaths(): SteamDeckPaths {
    const baseDirPath = path.join(DEVICES_DIR_PATH, this._name);

    const logsDirPath = path.join(baseDirPath, "logs");

    const listsDirPath = path.join(baseDirPath, "lists");
    const romsListsDirPath = path.join(listsDirPath, "roms");
    const mediaListsDirPath = path.join(listsDirPath, "media");

    const diffsDirPath = path.join(baseDirPath, "diffs");
    const romsDiffsDirPath = path.join(diffsDirPath, "roms");
    const mediaDiffsDirPath = path.join(diffsDirPath, "media");

    const failedDirPath = path.join(baseDirPath, "failed");
    const romsFailedDirPath = path.join(failedDirPath, "roms");
    const mediaFailedDirPath = path.join(failedDirPath, "media");

    const paths: SteamDeckPaths = {
      dirs: {
        fileIO: {
          base: baseDirPath,
          logs: {
            base: logsDirPath,
          },
          lists: {
            base: listsDirPath,
            roms: romsListsDirPath,
            media: {
              base: mediaListsDirPath,
              names: Object.fromEntries(
                MEDIA_NAMES.map((m) => [m, path.join(mediaListsDirPath, m)]),
              ) as MediaPaths,
            },
          },
          diffs: {
            base: diffsDirPath,
            roms: romsDiffsDirPath,
            media: {
              base: mediaDiffsDirPath,
              names: Object.fromEntries(
                MEDIA_NAMES.map((m) => [m, path.join(mediaDiffsDirPath, m)]),
              ) as MediaPaths,
            },
          },
          failed: {
            base: failedDirPath,
            roms: romsFailedDirPath,
            media: {
              base: mediaFailedDirPath,
              names: Object.fromEntries(
                MEDIA_NAMES.map((m) => [m, path.join(mediaFailedDirPath, m)]),
              ) as MediaPaths,
            },
          },
        },
        sync: {
          roms: {
            base: environment.devices["steam-deck"].paths.roms,
            consoles: Object.fromEntries(
              CONSOLE_NAMES.map((c) => [
                c,
                path.join(environment.devices["steam-deck"].paths.roms, c),
              ]),
            ) as ConsolePaths,
          },
          media: {
            base: path.join(environment.devices["steam-deck"].paths.media),
            consoles: Object.fromEntries(
              CONSOLE_NAMES.map((c) => [
                c,
                {
                  base: path.join(
                    environment.devices["steam-deck"].paths.media,
                    c,
                  ),
                  names: Object.fromEntries(
                    MEDIA_NAMES.map((m) => [
                      m,
                      path.join(
                        environment.devices["steam-deck"].paths.media,
                        c,
                        m,
                      ),
                    ]),
                  ),
                },
              ]),
            ) as ConsoleContent<{ base: string; names: MediaPaths }>,
          },
          metadata: {
            base: path.join(environment.devices["steam-deck"].paths.metadata),
            consoles: Object.fromEntries(
              CONSOLE_NAMES.map((c) => [
                c,
                path.join(environment.devices["steam-deck"].paths.metadata, c),
              ]),
            ) as ConsolePaths,
          },
        },
      },
      files: {
        fileIO: {
          logs: {
            duplicates: path.join(logsDirPath, "duplicates.log.txt"),
            scrapped: path.join(logsDirPath, "scrapped.log.txt"),
          },
          lists: {
            roms: {
              consoles: Object.fromEntries(
                CONSOLE_NAMES.map((c) => [
                  c,
                  path.join(romsListsDirPath, `${c}.list.txt`),
                ]),
              ) as ConsolePaths,
            },
            media: Object.fromEntries(
              MEDIA_NAMES.map((m) => [
                m,
                Object.fromEntries(
                  CONSOLE_NAMES.map((c) => [
                    c,
                    path.join(mediaListsDirPath, m, `${c}.list.txt`),
                  ]),
                ),
              ]),
            ) as MediaContent<ConsolePaths>,
          },
          diffs: {
            roms: {
              consoles: Object.fromEntries(
                CONSOLE_NAMES.map((c) => [
                  c,
                  path.join(romsDiffsDirPath, `${c}.diff.txt`),
                ]),
              ) as ConsolePaths,
            },
            media: Object.fromEntries(
              MEDIA_NAMES.map((m) => [
                m,
                Object.fromEntries(
                  CONSOLE_NAMES.map((c) => [
                    c,
                    path.join(mediaDiffsDirPath, m, `${c}.diff.txt`),
                  ]),
                ),
              ]),
            ) as MediaContent<ConsolePaths>,
          },
          failed: {
            roms: {
              consoles: Object.fromEntries(
                CONSOLE_NAMES.map((c) => [
                  c,
                  path.join(romsFailedDirPath, `${c}.failed.txt`),
                ]),
              ) as ConsolePaths,
            },
            media: Object.fromEntries(
              MEDIA_NAMES.map((m) => [
                m,
                Object.fromEntries(
                  CONSOLE_NAMES.map((c) => [
                    c,
                    path.join(mediaFailedDirPath, m, `${c}.failed.txt`),
                  ]),
                ),
              ]),
            ) as MediaContent<ConsolePaths>,
          },
        },
        sync: {
          metadata: {
            consoles: Object.fromEntries(
              CONSOLE_NAMES.map((c) => [
                c,
                path.join(
                  environment.devices["steam-deck"].paths.metadata,
                  c,
                  "gamelist.xml",
                ),
              ]),
            ) as ConsolePaths,
          },
        },
      },
    };

    return paths;
  }
}

export default SteamDeck;
