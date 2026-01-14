import path from "node:path";

import devices from "../../helpers/devices/index.js";
import type { Device } from "../../interfaces/device.interface.js";
import type { LocalPaths } from "../../interfaces/local-paths.interface.js";
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
import type { LocalConsolesSkipFlags } from "../../interfaces/local-consoles-skip-flags.interface.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import writeToFileOrDelete from "../../helpers/file-io/write-to-file-or-delete.helper.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import type { LocalData } from "../../interfaces/local-data.interface.js";

export type AddConsoleMethodError = AppNotFoundError | AppEntryExistsError;
export type GetConsoleRomsFailedFilePathError = AppNotFoundError;
export type GetConsoleRomsDiffFilePath = AppNotFoundError;
export type GetConsoleRomsSyncDirPath = AppNotFoundError;

const LOCAL = "local" as const;

class Local implements Device, Debug {
  private _name: typeof LOCAL = LOCAL;

  private _paths: LocalPaths;
  private _modes: LocalData["modes"];

  private _consoles: Consoles;
  private _consoleNames: ConsoleName[];

  private _consoleSkipFlags: Partial<ConsoleContent<LocalConsolesSkipFlags>>;

  constructor(
    consoleNames: ConsoleName[],
    env: Environment["devices"][typeof LOCAL],
  ) {
    const uniqueConsoleNames = [...new Set(consoleNames)];
    this._consoleNames = uniqueConsoleNames;

    this._consoleSkipFlags = Object.fromEntries(
      this._consoleNames.map((c) => [
        c,
        {
          global: false,
          filter: false,
          sync: false,
        },
      ]),
    ) as Partial<ConsoleContent<LocalConsolesSkipFlags>>;

    this._consoles = new Map<ConsoleName, Console>();
    for (const consoleName of this._consoleNames)
      this._addConsole(consoleName, new Console(consoleName));

    this._paths = this._initLocalPaths(env.paths);
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
          this._consoleSkipFlags[consoleName].sync = true;
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
    lists: async () => {
      logger.trace(`device.write.lists() starts for console ${this._name}.`);

      logger.trace(
        `Building list of directories to validate before actually writing list files for device ${this._name}.`,
      );

      const allDirPathsToValidate = [
        this._paths.dirs.fileIO.base,
        this._paths.dirs.fileIO.lists.base,
        this._paths.dirs.fileIO.lists.roms,
        this._paths.dirs.sync.roms.base,
      ];

      for (const consoleName of this._consoleNames)
        if (this._paths.dirs.sync.roms.consoles[consoleName])
          allDirPathsToValidate.push(
            this._paths.dirs.sync.roms.consoles[consoleName],
          );

      logger.debug(`Directory paths to validate: `, ...allDirPathsToValidate);

      const [allDirsAreValid, allDirsAreValidError] =
        await fileIO.allDirsExistAndAreReadable(allDirPathsToValidate);

      if (allDirsAreValidError) {
        logger.error(
          `${allDirsAreValidError.toString()}. Will NOT write list files for device ${this._name}.`,
        );
        return;
      }
      if (!allDirsAreValid) {
        logger.error(
          `Not all of the following directories exist and are read-write: ${allDirPathsToValidate.join(", ")}. Please make sure all of them are valid before attempting to write the list files for device ${this._name}.`,
        );
        return;
      }

      logger.info(
        `All list-relevant directories for device ${this._name} are valid. Continuing.`,
      );

      for (const consoleName of this._consoleNames) {
        logger.trace(`starting to write list file for console ${consoleName}`);

        const romsDirPath = this._paths.dirs.sync.roms.consoles[consoleName];
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
          this._paths.files.fileIO.lists.roms.consoles[consoleName];
        if (!listFilePath) {
          logger.warn(
            `There is no ROM list filepath for console ${consoleName}. Skipping.`,
          );
          continue;
        }

        logger.debug(
          `ROM list filepath for console ${consoleName}: ${listFilePath}`,
        );

        const [fileSymlinkEntries, readDirError] =
          await fileIO.readDirAndGetFileSymlinks(romsDirPath);

        if (readDirError) {
          logger.error(`${readDirError.toString()}. Skipping.`);
          continue;
        }

        logger.trace(`Successfully fetched file symlinks from ${romsDirPath}.`);

        const filenames = fileSymlinkEntries.map((e) => e.name.toString());

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

        // 1. couldn't delete previous diff file (if it existed)
        // 2. couldn't read list file
        // 3. couldn't open a new diff file
        // 4. couldn't write to the diff file
        const diffError = await fileIO.writeConsoleDiffFile(konsole, {
          list: this._paths.files.fileIO.lists.roms.consoles[consoleName],
          diff: this._paths.files.fileIO.diffs.roms.consoles[consoleName],
        });

        if (diffError) {
          logger.warn(
            `${diffError.toString()}\nSince we were not able to generate the diff file, we will skip this console when sync-ing.`,
          );

          if (this._consoleSkipFlags[consoleName])
            this._consoleSkipFlags[consoleName].sync = true;
        }
      }
    },
  };

  sync: () => Promise<void> = async () => {
    // 1. there are .failed.txt filenames for this device
    // 2. not all device sync dir paths exist
    // 3. failed to open new .failed.txt file to write on
    // 4. failed to open .diff.txt file
    const syncError = await devices.syncLocal(this);

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
    return Object.entries(this._paths.files.fileIO.failed.roms.consoles).map(
      ([, path]) => path,
    );
  }

  get allSyncDirPaths(): string[] {
    const paths = [this._paths.dirs.sync.roms.base];

    for (const consoleName of this._consoleNames)
      if (this._paths.dirs.sync.roms.consoles[consoleName])
        paths.push(this._paths.dirs.sync.roms.consoles[consoleName]);

    return paths;
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

  private _initLocalPaths(
    envPaths: Environment["devices"][typeof LOCAL]["paths"],
  ): LocalPaths {
    const baseDirPath = path.join(DEVICES_DIR_PATH, this._name);

    const logsDirPath = path.join(baseDirPath, "logs");

    const listsDirPath = path.join(baseDirPath, "lists");
    const romsListsDirPath = path.join(listsDirPath, "roms");

    const diffsDirPath = path.join(baseDirPath, "diffs");
    const romsDiffsDirPath = path.join(diffsDirPath, "roms");

    const failedDirPath = path.join(baseDirPath, "failed");
    const romsFailedDirPath = path.join(failedDirPath, "roms");

    const paths: LocalPaths = {
      dirs: {
        fileIO: {
          base: baseDirPath,
          logs: {
            base: logsDirPath,
          },
          lists: {
            base: listsDirPath,
            roms: romsListsDirPath,
          },
          diffs: {
            base: diffsDirPath,
            roms: romsDiffsDirPath,
          },
          failed: {
            base: failedDirPath,
            roms: romsFailedDirPath,
          },
        },
        sync: {
          roms: {
            base: envPaths.roms,
            consoles: Object.fromEntries(
              this._consoleNames.map((c) => [c, path.join(envPaths.roms, c)]),
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
          },
        },
      },
    };

    return paths;
  }
}

export default Local;
