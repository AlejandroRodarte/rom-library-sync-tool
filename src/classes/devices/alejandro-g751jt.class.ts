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
import build from "../../helpers/build/index.js";
import logger from "../../objects/logger.object.js";
import unselect from "../../helpers/unselect/index.js";
import type { DeviceWriteMethods } from "../../interfaces/device-write-methods.interface.js";
import fileIO from "../../helpers/file-io/index.js";
import databasePaths from "../../objects/database-paths.object.js";
import type { ConsoleContent } from "../../types/console-content.type.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import writeToFileOrDelete from "../../helpers/file-io/write-to-file-or-delete.helper.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import type { AlejandroG751JTPaths } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { AlejandroG751JTConsolesSkipFlags } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-consoles-skip-flags.interface.js";
import type { MediaName } from "../../types/media-name.type.js";
import type { MediaContent } from "../../types/media-content.type.js";
import Fs from "../device-io/fs.class.js";
import Sftp from "../device-io/sftp.class.js";
import SftpClient from "../sftp-client.class.js";
import type { ContentTargetName } from "../../types/content-target-name.type.js";
import type { MediaPaths } from "../../types/media-paths.type.js";

export type AddConsoleMethodError = AppNotFoundError | AppEntryExistsError;
export type GetConsoleRomsFailedFilePathError = AppNotFoundError;
export type GetConsoleRomsDiffFilePath = AppNotFoundError;
export type GetConsoleRomsSyncDirPath = AppNotFoundError;

const ALEJANDRO_G751JT = "alejandro-g751jt" as const;

class AlejandroG751JT implements Device, Debug {
  private _name: typeof ALEJANDRO_G751JT = ALEJANDRO_G751JT;

  private _paths: AlejandroG751JTPaths;

  private _consoles: Consoles;
  private _consoleNames: ConsoleName[];
  private _consoleSkipFlags: Partial<
    ConsoleContent<AlejandroG751JTConsolesSkipFlags>
  >;

  private _mediaNames: MediaName[];
  private _contentTargetNames: ContentTargetName[];

  private _deviceFileIO: DeviceFileIO;

  constructor(envData: Environment["device"]["data"][typeof ALEJANDRO_G751JT]) {
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
    ) as Partial<ConsoleContent<AlejandroG751JTConsolesSkipFlags>>;

    this._consoles = new Map<ConsoleName, Console>();
    for (const consoleName of this._consoleNames)
      this._addConsole(consoleName, new Console(consoleName));

    this._paths = this._initAlejandroG751JTPaths(
      envData["content-targets"].paths,
    );

    switch (envData.fileIO.strategy) {
      case "fs":
        this._deviceFileIO = new Fs();
        break;
      case "sftp":
        this._deviceFileIO = new Sftp(
          new SftpClient(
            ALEJANDRO_G751JT,
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
    for (const [, konsole] of this.filterableConsoles)
      konsole.unselectTitles(unselect.bySteamDeckDevice);
  };

  update: () => void = () => {
    for (const [, konsole] of this.filterableConsoles) {
      konsole.updateSelectedRoms();
      konsole.updateScrappedTitles();
      konsole.updateScrappedTitles();
    }
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
    lists: async () => {
      logger.trace(`device.write.lists() starts for console ${this._name}.`);

      logger.trace(
        `Building list of directories to validate before actually writing list files for device ${this._name}.`,
      );

      const projectDirPathsToValidate: string[] = [
        this._paths.dirs.project.base,
        this._paths.dirs.project.lists.base,
        this._paths.dirs.project.lists["content-targets"].roms,
        this._paths.dirs.project.lists["content-targets"].media.base,
      ];

      const contentTargetDirPathsToValidate: string[] = [
        this._paths.dirs["content-targets"].roms.base,
        this._paths.dirs["content-targets"].media.base,
        this._paths.dirs["content-targets"]["es-de-gamelists"].base,
      ];

      for (const consoleName of this._consoleNames) {
        const contentTargetRomDirPath =
          this._paths.dirs["content-targets"].roms.consoles[consoleName];
        if (contentTargetRomDirPath)
          contentTargetDirPathsToValidate.push(contentTargetRomDirPath);

        const contentTargetEsDeGamelistsDirPath =
          this._paths.dirs["content-targets"]["es-de-gamelists"].consoles[
            consoleName
          ];
        if (contentTargetEsDeGamelistsDirPath)
          contentTargetDirPathsToValidate.push(
            contentTargetEsDeGamelistsDirPath,
          );

        for (const mediaName of this._mediaNames) {
          const projectMediaDirPath =
            this._paths.dirs.project.lists["content-targets"].media.names[
              mediaName
            ];
          if (projectMediaDirPath)
            projectDirPathsToValidate.push(projectMediaDirPath);
        }

        const contentTargetMediaDirPath =
          this._paths.dirs["content-targets"].media.consoles[consoleName];

        if (contentTargetMediaDirPath) {
          contentTargetDirPathsToValidate.push(contentTargetMediaDirPath.base);

          for (const mediaName of this._mediaNames) {
            const contentTargetMediaNameDirPath =
              contentTargetMediaDirPath.names[mediaName];
            if (contentTargetMediaNameDirPath)
              contentTargetDirPathsToValidate.push(
                contentTargetMediaNameDirPath,
              );
          }
        }
      }

      logger.debug(
        `Project directories to validate: `,
        ...projectDirPathsToValidate,
      );

      logger.debug(
        `Content target directories to validate: `,
        ...contentTargetDirPathsToValidate,
      );

      const [allDirsAreValid, allDirsAreValidError] =
        await fileIO.allDirsExistAndAreReadable(projectDirPathsToValidate);

      if (allDirsAreValidError) {
        logger.error(
          `${allDirsAreValidError.toString()}. Will NOT write list files for device ${this._name}.`,
        );
        return;
      }
      if (!allDirsAreValid) {
        logger.error(
          `Not all of the following directories exist and are read-write: ${projectDirPathsToValidate.join(", ")}. Please make sure all of them are valid before attempting to write the list files for device ${this._name}.`,
        );
        return;
      }

      logger.info(
        `All list-relevant directories for device ${this._name} are valid. Continuing.`,
      );

      for (const consoleName of this._consoleNames) {
        logger.trace(`starting to write list file for console ${consoleName}`);

        const romsDirPath =
          this._paths.dirs["content-targets"].roms.consoles[consoleName];
        if (!romsDirPath) {
          logger.warn(
            `There is no ROM sync dirpath for console ${consoleName}. Skipping.`,
          );
          continue;
        }

        logger.debug(
          `ROMs sync dirpath for console ${consoleName}: ${romsDirPath}`,
        );

        const listFilePath =
          this._paths.files.project.lists.roms.consoles[consoleName];
        if (!listFilePath) {
          logger.warn(
            `There is no ROM list filepath for console ${consoleName}. Skipping.`,
          );
          continue;
        }

        logger.debug(
          `ROM list filepath for console ${consoleName}: ${listFilePath}`,
        );
        logger.trace(
          `About to attempt to fetch entries from device dirpath ${romsDirPath}`,
        );

        const [lsEntries, lsError] = await this._deviceFileIO.ls(romsDirPath);
        if (lsError) {
          logger.error(`${lsError.toString()}. Skipping.`);
          continue;
        }

        logger.info(
          `Successfully fetched entries from device dirpath ${romsDirPath}`,
        );
        logger.trace(
          `About to attempt to filter out entries found at ${romsDirPath} so only symlinks to files remain.`,
        );

        const [fileSymlinkEntries, readDirError] =
          await fileIO.getFileSymlinksFromDeviceFileIOLsEntries(lsEntries);

        if (readDirError) {
          logger.error(`${readDirError.toString()}. Skipping.`);
          continue;
        }

        logger.info(
          `Successfully obtained file symlinks found at ${romsDirPath}.`,
        );

        const filenames = fileSymlinkEntries.map((e) => e.name);

        logger.trace(
          `Deleting ${listFilePath} to create a new one and get its file handle.`,
        );

        const [listFileHandle, listFileError] =
          await fileIO.deleteAndOpenWriteOnlyFile(listFilePath);

        if (listFileError) {
          logger.error(`${listFileError.toString()}. Skipping.`);
          continue;
        }

        logger.trace(
          `Successfully created a new file at ${listFilePath}. About to attempt to write contents into it.`,
        );

        const writeError = await writeToFileOrDelete(
          listFilePath,
          listFileHandle,
          `${filenames.join("\n")}\n`,
          "utf8",
        );

        if (writeError) {
          logger.error(
            `${writeError.toString()}. Skipping and closing file handle`,
          );
          await listFileHandle.close();
          continue;
        }

        logger.trace(
          `Finished writing to file ${listFilePath}. Closing file handle.`,
        );

        await listFileHandle.close();

        logger.info(
          `Successfully generated ROMs list file at ${listFilePath} with contents from ROMs dir at ${romsDirPath}`,
        );
      }

      logger.trace(`device.write.lists() ends for console ${this._name}.`);
    },
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

        // 1. couldn't delete previous diff file (if it existed)
        // 2. couldn't read list file
        // 3. couldn't open a new diff file
        // 4. couldn't write to the diff file
        const diffError = await fileIO.writeConsoleDiffFile(konsole, {
          list: this._paths.files.project.lists.roms.consoles[consoleName],
          diff: this._paths.files.project.diffs.roms.consoles[consoleName],
        });

        if (diffError) {
          logger.warn(
            `${diffError.toString()}\nSince we were not able to generate the diff file, we will skip this console when sync-ing.`,
          );

          if (this._consoleSkipFlags[consoleName])
            this._consoleSkipFlags[consoleName].sync.global = true;
        }
      }
    },
  };

  sync: () => Promise<void> = async () => {
    // 1. there are .failed.txt filenames for this device
    // 2. not all device sync dir paths exist
    // 3. failed to open new .failed.txt file to write on
    // 4. failed to open .diff.txt file
    const syncError = await devices.syncAlejandroG751JT(this);

    if (syncError)
      logger.warn(
        `${syncError.toString()}\nWe were unable to sync this console.`,
      );
  };

  debug: () => string = () => {
    let content = "Local { ";

    content += `name: ${this._name}, `;
    content += `console-names: ${this._consoleNames.join(",")}, `;
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

  get syncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          this._consoleSkipFlags[consoleName] &&
          !this._consoleSkipFlags[consoleName].global &&
          !this._consoleSkipFlags[consoleName].filter &&
          !this._consoleSkipFlags[consoleName].sync,
      ),
    );
  }

  get allFailedFilePaths(): string[] {
    return Object.entries(this._paths.files.project.failed.roms.consoles).map(
      ([, path]) => path,
    );
  }

  get allSyncDirPaths(): string[] {
    const paths = [this._paths.dirs["content-targets"].roms.base];

    for (const consoleName of this._consoleNames)
      if (this._paths.dirs["content-targets"].roms.consoles[consoleName])
        paths.push(
          this._paths.dirs["content-targets"].roms.consoles[consoleName],
        );

    return paths;
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

  private _addConsole(
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

  private _initAlejandroG751JTPaths(
    contentTargetPaths: Environment["device"]["data"][typeof ALEJANDRO_G751JT]["content-targets"]["paths"],
  ): AlejandroG751JTPaths {
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

    const paths: AlejandroG751JTPaths = {
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

export default AlejandroG751JT;
