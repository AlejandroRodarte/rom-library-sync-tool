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
import type { ConsolePaths } from "../../types/console-paths.types.js";
import type { SteamDeckPaths } from "../../interfaces/steam-deck-paths.interface.js";
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
import type { Debug } from "../../interfaces/debug.interface.js";
import SftpClient from "../sftp-client.class.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import type { SteamDeckData } from "../../interfaces/steam-deck-data.interface.js";

export type AddConsoleMethodError = AppNotFoundError | AppEntryExistsError;
export type GetConsoleRomsFailedFilePathError = AppNotFoundError;
export type GetConsoleRomsDiffFilePath = AppNotFoundError;
export type GetConsoleRomsSyncDirPath = AppNotFoundError;

const STEAM_DECK = "steam-deck" as const;

class SteamDeck implements Device, Debug {
  private _name: typeof STEAM_DECK = STEAM_DECK;

  private _paths: SteamDeckPaths;
  private _modes: SteamDeckData["modes"];

  private _consoles: Consoles;
  private _consoleNames: ConsoleName[];
  private _mediaNames: MediaName[];

  private _consoleSkipFlags: Partial<
    ConsoleContent<SteamDeckConsolesSkipFlags>
  >;

  private _sftpClient: SftpClient;

  constructor(
    consoleNames: ConsoleName[],
    mediaNames: MediaName[],
    env: Environment["devices"][typeof STEAM_DECK],
  ) {
    const uniqueConsoleNames = [...new Set(consoleNames)];
    this._consoleNames = uniqueConsoleNames;

    const uniqueMediaNames = [...new Set(mediaNames)];
    this._mediaNames = uniqueMediaNames;

    this._consoleSkipFlags = Object.fromEntries(
      this._consoleNames.map((c) => [
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
                this._mediaNames.map((m) => [m, false]),
              ) as Partial<MediaContent<boolean>>,
            },
            metadata: false,
          },
        },
      ]),
    ) as Partial<ConsoleContent<SteamDeckConsolesSkipFlags>>;

    this._consoles = new Map<ConsoleName, Console>();
    for (const consoleName of this._consoleNames)
      this.addConsole(consoleName, new Console(consoleName));

    this._paths = this._initSteamDeckPaths(env.paths);
    this._sftpClient = new SftpClient(this._name, env.sftp.credentials);

    this._modes = env.modes;
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

        if (this._consoleSkipFlags[consoleName]) {
          this._consoleSkipFlags[consoleName].global = true;
          this._consoleSkipFlags[consoleName].filter = true;
          this._consoleSkipFlags[consoleName].sync.global = true;
        }

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
    lists: async () => {},
    diffs: async () => {
      for (const [consoleName, konsole] of this.filterableConsoles) {
        if (!this._paths.files.fileIO.lists.roms.consoles[consoleName]) {
          logger.warn(
            `There is no ROM list filepath for console ${consoleName}. Skipping.`,
          );
          continue;
        }

        if (!this._paths.files.fileIO.diffs.roms.consoles[consoleName]) {
          logger.warn(
            `There is no ROM diff filepath for console ${consoleName}. Skipping.`,
          );
          continue;
        }

        const diffError = await fileIO.writeConsoleDiffFile(konsole, {
          list: this._paths.files.fileIO.lists.roms.consoles[consoleName],
          diff: this._paths.files.fileIO.diffs.roms.consoles[consoleName],
        });

        if (diffError) {
          logger.warn(
            `${diffError.toString()}\nSince we were not able to generate the diff file, we will skip this console when sync-ing.`,
          );

          if (this._consoleSkipFlags[consoleName])
            this._consoleSkipFlags[consoleName].sync.roms = true;
        }
      }
    },
  };

  debug: () => string = () => {
    let content = "SteamDeck { ";

    content += `name: ${this._name}, `;
    content += `console-names: ${this._consoleNames.join(",")}, `;
    content += `media-names: ${this._mediaNames.join(",")}, `;
    content += "}";

    return content;
  };
  get filterableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          this._consoleSkipFlags[consoleName] &&
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter,
      ),
    );
  }

  get allSyncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          this._consoleSkipFlags[consoleName] &&
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
          this._consoleSkipFlags[consoleName] &&
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
          this._consoleSkipFlags[consoleName] &&
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
          this._consoleSkipFlags[consoleName] &&
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
          this._consoleSkipFlags[consoleName] &&
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

    for (const mediaName of this._mediaNames)
      if (this._paths.files.fileIO.failed.media[mediaName])
        for (const consoleName of this._consoleNames)
          if (this._paths.files.fileIO.failed.media[mediaName][consoleName])
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

    for (const consoleName of this._consoleNames) {
      if (this._paths.dirs.sync.media.consoles[consoleName]) {
        basePaths.push(this._paths.dirs.sync.media.consoles[consoleName].base);

        for (const mediaName of this._mediaNames)
          if (
            this._paths.dirs.sync.media.consoles[consoleName].names[mediaName]
          )
            mediaSyncPaths.push(
              this._paths.dirs.sync.media.consoles[consoleName].names[
                mediaName
              ],
            );
      }

      if (this._paths.dirs.sync.roms.consoles[consoleName])
        romsSyncPaths.push(this._paths.dirs.sync.roms.consoles[consoleName]);

      if (this._paths.dirs.sync.metadata.consoles[consoleName])
        metadataSyncPaths.push(
          this._paths.dirs.sync.metadata.consoles[consoleName],
        );
    }

    return [...basePaths, ...mediaSyncPaths, ...metadataSyncPaths];
  }

  private async _connect() {
    logger.trace(
      `Beggining attempt to connect to device ${this._name} via SFTP.`,
    );

    if (this._sftpClient.connected) {
      logger.warn(
        `SFTP Client for device ${this.name} is already connected. Doing nothing.`,
      );
      return;
    }

    const connectError = await this._sftpClient.connect();
    if (connectError) return connectError;

    logger.info(`Succesfully connected to ${this._name} device.`);
  }

  public getConsoleRomsFailedFilePath(
    consoleName: ConsoleName,
  ): [string, undefined] | [undefined, GetConsoleRomsFailedFilePathError] {
    const path = this._paths.files.fileIO.failed.roms.consoles[consoleName];
    if (path) return [path, undefined];
    return [
      undefined,
      new AppNotFoundError(
        `No ROM failed filepath for console ${consoleName}.`,
      ),
    ];
  }

  public getConsoleRomsDiffFilePath(
    consoleName: ConsoleName,
  ): [string, undefined] | [undefined, GetConsoleRomsDiffFilePath] {
    const path = this._paths.files.fileIO.diffs.roms.consoles[consoleName];
    if (path) return [path, undefined];
    return [
      undefined,
      new AppNotFoundError(`No ROM diff filepath for console ${consoleName}.`),
    ];
  }

  public getConsoleRomsSyncDirPath(
    consoleName: ConsoleName,
  ): [string, undefined] | [undefined, GetConsoleRomsSyncDirPath] {
    const path = this._paths.dirs.sync.roms.consoles[consoleName];
    if (path) return [path, undefined];
    return [
      undefined,
      new AppNotFoundError(`No ROM sync dirpath for console ${consoleName}.`),
    ];
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

  private _initSteamDeckPaths(
    paths: Environment["devices"][typeof STEAM_DECK]["paths"],
  ): SteamDeckPaths {
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

    const steamDeckPaths: SteamDeckPaths = {
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
                this._mediaNames.map((m) => [
                  m,
                  path.join(mediaListsDirPath, m),
                ]),
              ) as Partial<MediaPaths>,
            },
          },
          diffs: {
            base: diffsDirPath,
            roms: romsDiffsDirPath,
            media: {
              base: mediaDiffsDirPath,
              names: Object.fromEntries(
                this._mediaNames.map((m) => [
                  m,
                  path.join(mediaDiffsDirPath, m),
                ]),
              ) as Partial<MediaPaths>,
            },
          },
          failed: {
            base: failedDirPath,
            roms: romsFailedDirPath,
            media: {
              base: mediaFailedDirPath,
              names: Object.fromEntries(
                this._mediaNames.map((m) => [
                  m,
                  path.join(mediaFailedDirPath, m),
                ]),
              ) as Partial<MediaPaths>,
            },
          },
        },
        sync: {
          roms: {
            base: environment.devices["steam-deck"].paths.roms,
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                path.join(environment.devices["steam-deck"].paths.roms, c),
              ]),
            ) as Partial<ConsolePaths>,
          },
          media: {
            base: path.join(environment.devices["steam-deck"].paths.media),
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                {
                  base: path.join(
                    environment.devices["steam-deck"].paths.media,
                    c,
                  ),
                  names: Object.fromEntries(
                    this._mediaNames.map((m) => [
                      m,
                      path.join(
                        environment.devices["steam-deck"].paths.media,
                        c,
                        m,
                      ),
                    ]),
                  ) as Partial<MediaPaths>,
                },
              ]),
            ) as Partial<
              ConsoleContent<{ base: string; names: Partial<MediaPaths> }>
            >,
          },
          metadata: {
            base: path.join(environment.devices["steam-deck"].paths.metadata),
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                path.join(environment.devices["steam-deck"].paths.metadata, c),
              ]),
            ) as Partial<ConsolePaths>,
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
                this._consoleNames.map((c) => [
                  c,
                  path.join(romsListsDirPath, `${c}.list.txt`),
                ]),
              ) as Partial<ConsolePaths>,
            },
            media: Object.fromEntries(
              this._mediaNames.map((m) => [
                m,
                Object.fromEntries(
                  this._consoleNames.map((c) => [
                    c,
                    path.join(mediaListsDirPath, m, `${c}.list.txt`),
                  ]),
                ) as Partial<ConsolePaths>,
              ]),
            ) as Partial<MediaContent<Partial<ConsolePaths>>>,
          },
          diffs: {
            roms: {
              consoles: Object.fromEntries(
                this._consoleNames.map((c) => [
                  c,
                  path.join(romsDiffsDirPath, `${c}.diff.txt`),
                ]),
              ) as Partial<ConsolePaths>,
            },
            media: Object.fromEntries(
              this._mediaNames.map((m) => [
                m,
                Object.fromEntries(
                  this._consoleNames.map((c) => [
                    c,
                    path.join(mediaDiffsDirPath, m, `${c}.diff.txt`),
                  ]),
                ) as Partial<ConsolePaths>,
              ]),
            ) as Partial<MediaContent<Partial<ConsolePaths>>>,
          },
          failed: {
            roms: {
              consoles: Object.fromEntries(
                this._consoleNames.map((c) => [
                  c,
                  path.join(romsFailedDirPath, `${c}.failed.txt`),
                ]),
              ) as Partial<ConsolePaths>,
            },
            media: Object.fromEntries(
              this._mediaNames.map((m) => [
                m,
                Object.fromEntries(
                  this._consoleNames.map((c) => [
                    c,
                    path.join(mediaFailedDirPath, m, `${c}.failed.txt`),
                  ]),
                ) as Partial<ConsolePaths>,
              ]),
            ) as Partial<MediaContent<Partial<ConsolePaths>>>,
          },
        },
        sync: {
          metadata: {
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                path.join(paths.metadata, c, "gamelist.xml"),
              ]),
            ) as Partial<ConsolePaths>,
          },
        },
      },
    };

    return steamDeckPaths;
  }
}

export default SteamDeck;
