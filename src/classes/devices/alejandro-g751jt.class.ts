import path from "node:path";

import type { Device } from "../../interfaces/device.interface.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { Consoles } from "../../types/consoles.type.js";
import type { DeviceName } from "../../types/device-name.type.js";
import Console from "../console.class.js";
import AppExistsError from "../errors/app-exists-error.class.js";
import AppNotFoundError from "../errors/app-not-found-error.class.js";
import { DEVICES_DIR_PATH } from "../../constants/paths.constants.js";
import type { ConsolePaths } from "../../types/console-paths.types.js";
import logger from "../../objects/logger.object.js";
import unselect from "../../helpers/unselect/index.js";
import type { DeviceWriteMethods } from "../../interfaces/device-write-methods.interface.js";
import databasePaths from "../../objects/database-paths.object.js";
import type { ConsoleContent } from "../../types/console-content.type.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import type { FileIO } from "../../interfaces/file-io.interface.js";
import type { AlejandroG751JTPaths } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { AlejandroG751JTConsolesSkipFlags } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-consoles-skip-flags.interface.js";
import type { MediaName } from "../../types/media-name.type.js";
import type { MediaContent } from "../../types/media-content.type.js";
import type { MediaPaths } from "../../types/media-paths.type.js";
import type { ContentTargetContent } from "../../types/content-target-content.type.js";
import CONTENT_TARGET_NAMES from "../../constants/content-target-names.constant.js";
import writeDuplicateRomsFile from "../../helpers/extras/fs/write-duplicate-roms-file.helper.js";
import writeScrappedRomsFile from "../../helpers/extras/fs/write-scrapped-roms-file.helper.js";
import writeToFileOrDelete from "../../helpers/extras/fs/write-to-file-or-delete.helper.js";
import deleteAndOpenWriteOnlyFile from "../../helpers/extras/fs/delete-and-open-new-write-only-file.helper.js";
import writeConsoleDiffFile from "../../helpers/extras/fs/write-console-diff-file.helper.js";
import FileIOExtras, {
  type DirAccessItem,
} from "../file-io/file-io-extras.class.js";
import dirExists from "../../helpers/extras/fs/dir-exists.helper.js";
import titlesFromRomsDirPath from "../../helpers/build/titles-from-roms-dir-path.helper.js";
import allDirsExist from "../../helpers/extras/fs/all-dirs-exist.helper.js";
import writeRomsLists from "../../helpers/classes/devices/alejandro-g751jt/write-roms-lists.helper.js";
import type { AlejandroG751JTSkipFlags } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-skip-flags.interface.js";
import getMediaListsProjectDirs from "../../helpers/classes/devices/alejandro-g751jt/get-media-lists-project-dirs.helper.js";
import getMediaListsDeviceDirs from "../../helpers/classes/devices/alejandro-g751jt/get-media-lists-device-dirs.helper.js";
import type { ContentTargetName } from "../../types/content-target-name.type.js";
import type { AlejandroG751JTShouldProcessContentTargetFlags } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-should-process-content-targets-flags.interface.js";
import openFileForWriting from "../../helpers/extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../helpers/extras/fs/write-lines.helper.js";

export type AddConsoleMethodError = AppNotFoundError | AppExistsError;
export type GetConsoleRomsFailedFilePathError = AppNotFoundError;
export type GetConsoleRomsDiffFilePath = AppNotFoundError;
export type GetConsoleRomsSyncDirPath = AppNotFoundError;

const build = {
  titlesFromRomsDirPath,
};

const fsExtras = {
  dirExists,
  allDirsExist,
  writeDuplicateRomsFile,
  writeScrappedRomsFile,
  writeToFileOrDelete,
  deleteAndOpenWriteOnlyFile,
  writeConsoleDiffFile,
};

const ALEJANDRO_G751JT = "alejandro-g751jt" as const;

class AlejandroG751JT implements Device, Debug {
  private _name: typeof ALEJANDRO_G751JT = ALEJANDRO_G751JT;

  private _paths: AlejandroG751JTPaths;

  private _consoles: Consoles;
  private _consoleNames: ConsoleName[];

  private _skipFlags: AlejandroG751JTSkipFlags;

  private _mediaNames: MediaName[];

  private _fileIOExtras: FileIOExtras;

  private _shouldProcessContentTargets: {
    [C in ContentTargetName]: AlejandroG751JTShouldProcessContentTargetFlags[C];
  };

  constructor(
    envData: Environment["device"]["data"][typeof ALEJANDRO_G751JT],
    fileIO: FileIO,
  ) {
    const uniqueConsoleNames = [...new Set(envData.console.names)];
    this._consoleNames = uniqueConsoleNames;

    const uniqueMediaNames = [...new Set(envData.media.names)];
    this._mediaNames = uniqueMediaNames;

    this._fileIOExtras = new FileIOExtras(fileIO);

    const uniqueContentTargetNames = [
      ...new Set(envData["content-targets"].names),
    ];

    this._shouldProcessContentTargets = {
      roms: uniqueContentTargetNames.includes("roms"),
      media: {
        global: uniqueContentTargetNames.includes("media"),
        names: Object.fromEntries(
          this._mediaNames.map((m) => [m, true]),
        ) as Partial<MediaContent<boolean>>,
      },
      "es-de-gamelists": uniqueContentTargetNames.includes("es-de-gamelists"),
    };

    this._skipFlags = {
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
      consoles: Object.fromEntries(
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
      ) as Partial<ConsoleContent<AlejandroG751JTConsolesSkipFlags>>,
    };

    this._consoles = new Map<ConsoleName, Console>();
    for (const consoleName of this._consoleNames)
      this._addConsole(consoleName, new Console(consoleName));

    this._paths = this._initAlejandroG751JTPaths(
      envData["content-targets"].paths,
    );

    logger.debug(this.debug());
  }

  name: () => DeviceName = () => {
    return this._name;
  };

  consoles: () => Consoles = () => {
    return this._consoles;
  };

  populate: () => Promise<void> = async () => {
    for (const [consoleName, konsole] of this._consoles) {
      const consoleDatabaseRomDirPath =
        databasePaths.getConsoleDatabaseRomDirPath(consoleName);

      const [dbPathExistsResult, dbPathExistsError] = await fsExtras.dirExists(
        consoleDatabaseRomDirPath,
        "r",
      );

      if (dbPathExistsError) {
        this._skipConsoleGlobal(consoleName);
        continue;
      }

      if (!dbPathExistsResult.exists) {
        this._skipConsoleGlobal(consoleName);
        continue;
      }

      const [titles, buildTitlesError] = await build.titlesFromRomsDirPath(
        consoleDatabaseRomDirPath,
      );

      if (buildTitlesError) {
        this._skipConsoleGlobal(consoleName);
        continue;
      }

      for (const [titleName, title] of titles)
        konsole.addTitle(titleName, title);
    }
  };

  filter: () => void = () => {
    for (const [, konsole] of this.filterableConsoles)
      konsole.unselectTitles(unselect.byLocalDevice);
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
      const writeError = await fsExtras.writeDuplicateRomsFile(
        this.filterableConsoles,
        this._paths.files.project.logs.duplicates,
      );
      if (writeError) logger.error(writeError.toString());
    },
    scrapped: async () => {
      const writeError = await fsExtras.writeScrappedRomsFile(
        this.filterableConsoles,
        this._paths.files.project.logs.scrapped,
      );
      if (writeError) logger.error(writeError.toString());
    },
    lists: async () => {
      logger.trace(`device.write.lists() starts for device ${this._name}.`);

      if (
        this._shouldProcessContentTargets.roms &&
        !this._skipFlags["content-targets"].roms
      ) {
        const [consolesToSkip, writeError] = await writeRomsLists(
          this._paths,
          this._consoleNames,
          this._fileIOExtras,
        );

        if (writeError) {
          this._skipRomsContentTarget();
          return;
        }

        for (const consoleName of consolesToSkip)
          this._skipConsoleRoms(consoleName);
      }

      if (
        this._shouldProcessContentTargets.media.global &&
        !this._skipFlags["content-targets"].media.global
      ) {
        const projectDirs = getMediaListsProjectDirs(
          this._paths.dirs.project.lists["content-targets"].media,
          this._mediaNames,
        );

        const projectDirAccessItems: DirAccessItem[] = projectDirs.map((p) => ({
          type: "dir",
          path: p,
          rights: "rw",
        }));

        const [allProjectDirsExistResult, allProjectDirsExistError] =
          await allDirsExist(projectDirAccessItems);

        if (allProjectDirsExistError) {
          logger.warn(allProjectDirsExistError.toString());
          this._skipMediaContentTarget();
          return;
        }

        if (!allProjectDirsExistResult.allExist) {
          logger.warn(allProjectDirsExistResult.error.toString());
          this._skipMediaContentTarget();
          return;
        }

        const deviceDirs = getMediaListsDeviceDirs(
          this._paths.dirs["content-targets"].media,
          this._consoleNames,
          this._mediaNames,
        );

        const deviceDirAccessItems: DirAccessItem[] = deviceDirs.map((p) => ({
          type: "dir",
          path: p,
          rights: "r",
        }));

        const [allDeviceDirsExistResult, allDeviceDirsExistError] =
          await this._fileIOExtras.allDirsExist(deviceDirAccessItems);

        if (allDeviceDirsExistError) {
          logger.warn(allDeviceDirsExistError.toString());
          this._skipMediaContentTarget();
          return;
        }

        if (!allDeviceDirsExistResult.allExist) {
          logger.warn(allDeviceDirsExistResult.error.toString());
          this._skipMediaContentTarget();
          return;
        }

        for (const mediaName of this._mediaNames) {
          const shouldProcessFlag =
            this._shouldProcessContentTargets.media.names[mediaName];

          if (typeof shouldProcessFlag === "undefined") {
            this._skipMediaNameContentTarget(mediaName);
            continue;
          }

          const skipFlag =
            this._skipFlags["content-targets"].media.names[mediaName];

          if (typeof skipFlag === "undefined") {
            this._skipMediaNameContentTarget(mediaName);
            continue;
          }

          const projectMediaNameDirs =
            this._paths.files.project.lists.media[mediaName];

          if (!projectMediaNameDirs) {
            this._skipMediaNameContentTarget(mediaName);
            continue;
          }

          if (shouldProcessFlag && !skipFlag) {
            for (const consoleName of this._consoleNames) {
              const deviceConsoleMediaDirs =
                this._paths.dirs["content-targets"].media.consoles[consoleName];

              if (!deviceConsoleMediaDirs) {
                this._skipConsoleMedia(consoleName);
                continue;
              }

              const deviceConsoleMediaNameDir =
                deviceConsoleMediaDirs.names[mediaName];

              if (!deviceConsoleMediaNameDir) {
                this._skipConsoleMediaName(consoleName, mediaName);
                continue;
              }

              const projectConsoleMediaNameFile =
                projectMediaNameDirs[consoleName];

              if (!projectConsoleMediaNameFile) {
                this._skipConsoleMediaName(consoleName, mediaName);
                continue;
              }

              logger.debug(
                deviceConsoleMediaNameDir,
                projectConsoleMediaNameFile,
              );

              const [lsEntries, lsError] = await this._fileIOExtras.fileIO.ls(
                deviceConsoleMediaNameDir,
              );

              if (lsError) {
                this._skipConsoleMediaName(consoleName, mediaName);
                continue;
              }

              const filenames = lsEntries.map((e) => e.name);

              const [listFileHandle, listFileError] = await openFileForWriting(
                projectConsoleMediaNameFile,
                { overwrite: true },
              );

              if (listFileError) {
                this._skipConsoleMediaName(consoleName, mediaName);
                continue;
              }

              const writeLinesError = await writeLines(
                listFileHandle,
                filenames,
                "utf8",
              );

              if (writeLinesError) {
                await listFileHandle.close();
                this._skipConsoleMediaName(consoleName, mediaName);
                continue;
              }

              await listFileHandle.close();
            }
          }
        }
      }
    },
    diffs: async () => {
      for (const [consoleName, konsole] of this.filterableConsoles) {
        if (!this._paths.files.project.lists.roms.consoles[consoleName])
          continue;

        if (!this._paths.files.project.diffs.roms.consoles[consoleName])
          continue;

        // 1. couldn't delete previous diff file (if it existed)
        // 2. couldn't read list file
        // 3. couldn't open a new diff file
        // 4. couldn't write to the diff file
        const diffError = await fsExtras.writeConsoleDiffFile(konsole, {
          list: this._paths.files.project.lists.roms.consoles[consoleName],
          diff: this._paths.files.project.diffs.roms.consoles[consoleName],
        });
      }
    },
  };

  sync: () => Promise<void> = async () => {};

  debug: () => string = () => {
    let content = "AlejandroG751JT { ";

    content += `name: ${this._name}, `;
    content += `content-targets: ${CONTENT_TARGET_NAMES.filter((c) => this._shouldProcessContentTargets[c] === true).join(", ")}, `;
    content += `console-names: ${this._consoleNames.join(",")}, `;
    content += `media-names: ${this._mediaNames.join(", ")} `;
    content += "}";

    return content;
  };

  get filterableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          this._skipFlags.consoles[consoleName] &&
          !this._skipFlags.consoles[consoleName].global &&
          !this._skipFlags.consoles[consoleName].filter,
      ),
    );
  }

  get syncableConsoles(): Consoles {
    return new Map(
      [...this._consoles.entries()].filter(
        ([consoleName]) =>
          this._skipFlags.consoles[consoleName] &&
          !this._skipFlags.consoles[consoleName].global &&
          !this._skipFlags.consoles[consoleName].filter &&
          !this._skipFlags.consoles[consoleName].sync,
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
      return new AppExistsError(
        `There is already an entry for console ${consoleName}.`,
      );

    this._consoles.set(consoleName, konsole);
  }

  private _skipConsoleGlobal(consoleName: ConsoleName) {
    if (this._skipFlags.consoles[consoleName]) {
      this._skipFlags.consoles[consoleName].global = true;
      this._skipFlags.consoles[consoleName].filter = true;
      this._skipFlags.consoles[consoleName].sync.global = true;
    }
  }

  private _skipConsoleRoms(consoleName: ConsoleName) {
    if (this._skipFlags.consoles[consoleName])
      this._skipFlags.consoles[consoleName].sync["content-targets"].roms = true;
  }

  private _skipConsoleMedia(consoleName: ConsoleName) {
    if (this._skipFlags.consoles[consoleName])
      this._skipFlags.consoles[consoleName].sync[
        "content-targets"
      ].media.global = true;
  }

  private _skipConsoleMediaName(
    consoleName: ConsoleName,
    mediaName: MediaName,
  ) {
    if (this._skipFlags.consoles[consoleName]) {
      if (
        typeof this._skipFlags.consoles[consoleName].sync["content-targets"]
          .media.names[mediaName] === "boolean"
      )
        this._skipFlags.consoles[consoleName].sync[
          "content-targets"
        ].media.names[mediaName] = false;
    }
  }

  private _skipRomsContentTarget() {
    this._skipFlags["content-targets"].roms = true;
    this._shouldProcessContentTargets.roms = false;
  }

  private _skipMediaContentTarget() {
    this._skipFlags["content-targets"].media.global = true;
    this._shouldProcessContentTargets.media.global = false;
  }

  private _skipMediaNameContentTarget(mediaName: MediaName) {
    if (
      typeof this._skipFlags["content-targets"].media.names[mediaName] ===
      "boolean"
    ) {
      this._skipFlags["content-targets"].media.names[mediaName] = true;
      this._shouldProcessContentTargets.media.names[mediaName] = false;
    }
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
