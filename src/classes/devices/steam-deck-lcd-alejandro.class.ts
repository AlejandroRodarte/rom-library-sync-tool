import path from "node:path";

import devices from "../../helpers/devices/index.js";
import type { Device } from "../../interfaces/device.interface.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { Consoles } from "../../types/consoles.type.js";
import type { DeviceName } from "../../types/device-name.type.js";
import Console from "../console.class.js";
import AppEntryExistsError from "../errors/app-entry-exists-error.class.js";
import AppNotFoundError from "../errors/app-not-found-error.class.js";
import { DEVICES_DIR_PATH } from "../../constants/paths.constants.js";
import type { ConsolePaths } from "../../types/console-paths.types.js";
import type { MediaPaths } from "../../types/media-paths.type.js";
import type { ConsoleContent } from "../../types/console-content.type.js";
import type { MediaContent } from "../../types/media-content.type.js";
import build from "../../helpers/build/index.js";
import logger from "../../objects/logger.object.js";
import unselect from "../../helpers/unselect/index.js";
import databasePaths from "../../objects/database-paths.object.js";
import type { MediaName } from "../../types/media-name.type.js";
import type { DeviceWriteMethods } from "../../interfaces/device-write-methods.interface.js";
import fileIO from "../../helpers/file-io/index.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import SftpClient from "../sftp-client.class.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import type { SteamDeckLCDAlejandroPaths } from "../../interfaces/devices/steam-deck-lcd-alejandro/steam-deck-lcd-alejandro-paths.interface.js";
import type { SteamDeckLCDAlejandroConsoleSkipFlags } from "../../interfaces/devices/steam-deck-lcd-alejandro/steam-deck-lcd-alejandro-consoles-skip-flags.interface.js";
import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import type { ContentTargetName } from "../../types/content-target-name.type.js";
import Sftp from "../device-file-io/sftp.class.js";
import Fs from "../device-file-io/fs.class.js";

export type AddConsoleMethodError = AppNotFoundError | AppEntryExistsError;
export type GetConsoleRomsFailedFilePathError = AppNotFoundError;
export type GetConsoleRomsDiffFilePath = AppNotFoundError;
export type GetConsoleRomsSyncDirPath = AppNotFoundError;

const STEAM_DECK_LCD_ALEJANDRO = "steam-deck-lcd-alejandro" as const;

class SteamDeckLCDAlejandro implements Device, Debug {
  private _name: typeof STEAM_DECK_LCD_ALEJANDRO = STEAM_DECK_LCD_ALEJANDRO;

  private _paths: SteamDeckLCDAlejandroPaths;

  private _consoles: Consoles;
  private _consoleNames: ConsoleName[];
  private _consoleSkipFlags: Partial<
    ConsoleContent<SteamDeckLCDAlejandroConsoleSkipFlags>
  >;

  private _mediaNames: MediaName[];
  private _contentTargetNames: ContentTargetName[];

  private _deviceFileIO: DeviceFileIO;

  constructor(
    envData: Environment["device"]["data"][typeof STEAM_DECK_LCD_ALEJANDRO],
  ) {
    const uniqueConsoleNames = [...new Set(envData.console.names)];
    this._consoleNames = uniqueConsoleNames;

    const uniqueMediaNames = [...new Set(envData.media.names)];
    this._mediaNames = uniqueMediaNames;

    const uniqueContentTargetNames = [
      ...new Set(envData["content-targets"].names),
    ];
    this._contentTargetNames = uniqueContentTargetNames;

    this._consoleSkipFlags = Object.fromEntries(
      this._consoleNames.map((c) => [
        c,
        {
          global: false,
          filter: false,
          sync: {
            global: false,
            "content-targets": {
              roms: false,
              media: {
                global: false,
                names: Object.fromEntries(
                  this._mediaNames.map((m) => [m, false]),
                ) as Partial<MediaContent<boolean>>,
              },
              "es-de-gamelists": false,
            },
          },
        },
      ]),
    ) as Partial<ConsoleContent<SteamDeckLCDAlejandroConsoleSkipFlags>>;

    this._consoles = new Map<ConsoleName, Console>();
    for (const consoleName of this._consoleNames)
      this.addConsole(consoleName, new Console(consoleName));

    this._paths = this._initSteamDeckLCDAlejandroPaths(
      envData["content-targets"].paths,
    );

    switch (envData.fileIO.strategy) {
      case "fs":
        this._deviceFileIO = new Fs();
        break;
      case "sftp":
        this._deviceFileIO = new Sftp(
          new SftpClient(
            STEAM_DECK_LCD_ALEJANDRO,
            envData.fileIO.data.sftp.credentials,
          ),
        );
        break;
    }
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
    await devices.syncSteamDeckLCDAlejandro(this);
  };

  write: DeviceWriteMethods = {
    duplicates: async () => {
      const writeError = await fileIO.writeDuplicateRomsFile(
        this.filterableConsoles,
        this._paths.files.project.logs.duplicates,
      );
      if (writeError) logger.error(writeError.toString());
    },
    scrapped: async () => {
      const writeError = await fileIO.writeScrappedRomsFile(
        this.filterableConsoles,
        this._paths.files.project.logs.scrapped,
      );
      if (writeError) logger.error(writeError.toString());
    },
    lists: async () => {},
    diffs: async () => {
      for (const [consoleName, konsole] of this.filterableConsoles) {
        if (!this._paths.files.project.lists.roms.consoles[consoleName]) {
          logger.warn(
            `There is no ROM list filepath for console ${consoleName}. Skipping.`,
          );
          continue;
        }

        if (!this._paths.files.project.diffs.roms.consoles[consoleName]) {
          logger.warn(
            `There is no ROM diff filepath for console ${consoleName}. Skipping.`,
          );
          continue;
        }

        const diffError = await fileIO.writeConsoleDiffFile(konsole, {
          list: this._paths.files.project.lists.roms.consoles[consoleName],
          diff: this._paths.files.project.diffs.roms.consoles[consoleName],
        });

        if (diffError) {
          logger.warn(
            `${diffError.toString()}\nSince we were not able to generate the diff file, we will skip this console when sync-ing.`,
          );

          if (this._consoleSkipFlags[consoleName])
            this._consoleSkipFlags[consoleName].sync["content-targets"].roms =
              true;
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
          !this._consoleSkipFlags[consoleName].sync["content-targets"].roms,
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
          !this._consoleSkipFlags[consoleName].sync["content-targets"].media
            .global,
      ),
    );
  }

  get allEsDeGamelistsSyncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          this._consoleSkipFlags[consoleName] &&
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter &&
          !this._consoleSkipFlags[consoleName].sync.global &&
          !this._consoleSkipFlags[consoleName].sync["content-targets"][
            "es-de-gamelists"
          ],
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
          !this._consoleSkipFlags[consoleName].sync["content-targets"].media
            .global &&
          !this._consoleSkipFlags[consoleName].sync["content-targets"].media
            .names[mediaName],
      ),
    );
  }

  get allFailedFilePaths(): string[] {
    const romsFailedPaths = Object.entries(
      this._paths.files.project.failed.roms.consoles,
    ).map(([, path]) => path);

    const mediaFailedPaths: string[] = [];

    for (const mediaName of this._mediaNames)
      if (this._paths.files.project.failed.media[mediaName])
        for (const consoleName of this._consoleNames)
          if (this._paths.files.project.failed.media[mediaName][consoleName])
            mediaFailedPaths.push(
              this._paths.files.project.failed.media[mediaName][consoleName],
            );

    return [...romsFailedPaths, ...mediaFailedPaths];
  }

  get allSyncDirPaths(): string[] {
    const basePaths: string[] = [
      this._paths.dirs["content-targets"].roms.base,
      this._paths.dirs["content-targets"].media.base,
      this._paths.dirs["content-targets"]["es-de-gamelists"].base,
    ];

    const romsSyncPaths: string[] = [];
    const mediaSyncPaths: string[] = [];
    const metadataSyncPaths: string[] = [];

    for (const consoleName of this._consoleNames) {
      if (this._paths.dirs["content-targets"].media.consoles[consoleName]) {
        basePaths.push(
          this._paths.dirs["content-targets"].media.consoles[consoleName].base,
        );

        for (const mediaName of this._mediaNames)
          if (
            this._paths.dirs["content-targets"].media.consoles[consoleName]
              .names[mediaName]
          )
            mediaSyncPaths.push(
              this._paths.dirs["content-targets"].media.consoles[consoleName]
                .names[mediaName],
            );
      }

      if (this._paths.dirs["content-targets"].roms.consoles[consoleName])
        romsSyncPaths.push(
          this._paths.dirs["content-targets"].roms.consoles[consoleName],
        );

      if (
        this._paths.dirs["content-targets"]["es-de-gamelists"].consoles[
          consoleName
        ]
      )
        metadataSyncPaths.push(
          this._paths.dirs["content-targets"]["es-de-gamelists"].consoles[
            consoleName
          ],
        );
    }

    return [...basePaths, ...mediaSyncPaths, ...metadataSyncPaths];
  }

  public getConsoleRomsFailedFilePath(
    consoleName: ConsoleName,
  ): [string, undefined] | [undefined, GetConsoleRomsFailedFilePathError] {
    const path = this._paths.files.project.failed.roms.consoles[consoleName];
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
    const path = this._paths.files.project.diffs.roms.consoles[consoleName];
    if (path) return [path, undefined];
    return [
      undefined,
      new AppNotFoundError(`No ROM diff filepath for console ${consoleName}.`),
    ];
  }

  public getConsoleRomsSyncDirPath(
    consoleName: ConsoleName,
  ): [string, undefined] | [undefined, GetConsoleRomsSyncDirPath] {
    const path = this._paths.dirs["content-targets"].roms.consoles[consoleName];
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

  private _initSteamDeckLCDAlejandroPaths(
    contentTargetPaths: Environment["device"]["data"][typeof STEAM_DECK_LCD_ALEJANDRO]["content-targets"]["paths"],
  ): SteamDeckLCDAlejandroPaths {
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

    const paths: SteamDeckLCDAlejandroPaths = {
      dirs: {
        project: {
          base: baseDirPath,
          logs: {
            base: logsDirPath,
          },
          lists: {
            base: listsDirPath,
            "content-targets": {
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
          },
          diffs: {
            base: diffsDirPath,
            "content-targets": {
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
          },
          failed: {
            base: failedDirPath,
            "content-targets": {
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
        },
        "content-targets": {
          roms: {
            base: contentTargetPaths.roms,
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                path.join(contentTargetPaths.roms, c),
              ]),
            ) as Partial<ConsolePaths>,
          },
          media: {
            base: contentTargetPaths.media,
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                {
                  base: path.join(contentTargetPaths.media, c),
                  names: Object.fromEntries(
                    this._mediaNames.map((m) => [
                      m,
                      path.join(contentTargetPaths.media, c, m),
                    ]),
                  ) as Partial<MediaPaths>,
                },
              ]),
            ) as Partial<
              ConsoleContent<{ base: string; names: Partial<MediaPaths> }>
            >,
          },
          "es-de-gamelists": {
            base: contentTargetPaths["es-de-gamelists"],
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                path.join(contentTargetPaths["es-de-gamelists"], c),
              ]),
            ) as Partial<ConsolePaths>,
          },
        },
      },
      files: {
        project: {
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
        "content-targets": {
          "es-de-gamelists": {
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [
                c,
                path.join(
                  contentTargetPaths["es-de-gamelists"],
                  c,
                  "gamelist.xml",
                ),
              ]),
            ),
          },
        },
      },
    };

    return paths;
  }
}

export default SteamDeckLCDAlejandro;
