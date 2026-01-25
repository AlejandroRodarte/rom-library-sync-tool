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
import type { DeviceWriteMethods } from "../../interfaces/device-write-methods.interface.js";
import type { ConsoleContent } from "../../types/console-content.type.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import type { FileIO } from "../../interfaces/file-io.interface.js";
import type { AlejandroG751JTPaths } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { AlejandroG751JTConsolesSkipFlags } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-consoles-skip-flags.interface.js";
import type { MediaName } from "../../types/media-name.type.js";
import type { MediaContent } from "../../types/media-content.type.js";
import type { MediaPaths } from "../../types/media-paths.type.js";
import CONTENT_TARGET_NAMES from "../../constants/content-target-names.constant.js";
import writeDuplicateRomsFile from "../../helpers/extras/fs/write-duplicate-roms-file.helper.js";
import writeScrappedRomsFile from "../../helpers/extras/fs/write-scrapped-roms-file.helper.js";
import writeToFileOrDelete from "../../helpers/extras/fs/write-to-file-or-delete.helper.js";
import deleteAndOpenWriteOnlyFile from "../../helpers/extras/fs/delete-and-open-new-write-only-file.helper.js";
import writeConsoleDiffFile from "../../helpers/extras/fs/write-console-diff-file.helper.js";
import FileIOExtras from "../file-io/file-io-extras.class.js";
import dirExists from "../../helpers/extras/fs/dir-exists.helper.js";
import allDirsExist from "../../helpers/extras/fs/all-dirs-exist.helper.js";
import writeRomsLists from "../../helpers/classes/devices/alejandro-g751jt/write-roms-lists.helper.js";
import type { AlejandroG751JTSkipFlags } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-skip-flags.interface.js";
import type { ContentTargetName } from "../../types/content-target-name.type.js";
import type { AlejandroG751JTShouldProcessContentTargetFlags } from "../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-should-process-content-targets-flags.interface.js";
import type { ConsolesData } from "../../types/consoles-data.type.js";
import writeMediaLists from "../../helpers/classes/devices/alejandro-g751jt/write-media-lists.helper.js";
import populateConsoles from "../../helpers/classes/devices/alejandro-g751jt/populate-consoles.helper.js";
import filterConsoles from "../../helpers/classes/devices/alejandro-g751jt/filter-consoles.helper.js";
import writeRomsDiffs from "../../helpers/classes/devices/alejandro-g751jt/write-roms-diffs.helper.js";
import type { ConsoleRoms } from "../../types/console-roms.type.js";
import writeMediaDiffs from "../../helpers/classes/devices/alejandro-g751jt/write-media-diffs.helper.js";

export type AddConsoleMethodError = AppNotFoundError | AppExistsError;
export type GetConsoleRomsFailedFilePathError = AppNotFoundError;
export type GetConsoleRomsDiffFilePath = AppNotFoundError;
export type GetConsoleRomsSyncDirPath = AppNotFoundError;

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
  private _consolesData: ConsolesData;
  private _consoleNames: ConsoleName[];

  private _allMediaNames: MediaName[];

  private _skipFlags: AlejandroG751JTSkipFlags;
  private _fileIOExtras: FileIOExtras;

  private _shouldProcessContentTargets: {
    [C in ContentTargetName]: AlejandroG751JTShouldProcessContentTargetFlags[C];
  };

  constructor(
    envData: Environment["device"]["data"][typeof ALEJANDRO_G751JT],
    fileIO: FileIO,
  ) {
    this._consolesData = envData.consoles;
    this._consoleNames = Object.entries(this._consolesData).map(
      ([, c]) => c.name,
    );

    this._fileIOExtras = new FileIOExtras(fileIO);

    const uniqueContentTargetNames = [
      ...new Set(envData["content-targets"].names),
    ];

    const allMediaNames = new Set<MediaName>();
    for (const [, consoleData] of Object.entries(this._consolesData)) {
      for (const mediaName of consoleData["content-targets"].media.names)
        if (!allMediaNames.has(mediaName)) allMediaNames.add(mediaName);
    }

    this._allMediaNames = [...allMediaNames];

    this._shouldProcessContentTargets = {
      roms: uniqueContentTargetNames.includes("roms"),
      media: {
        global: uniqueContentTargetNames.includes("media"),
        names: Object.fromEntries(
          this._allMediaNames.map((m) => [m, true]),
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
            this._allMediaNames.map((m) => [m, false]),
          ) as Partial<MediaContent<boolean>>,
        },
        "es-de-gamelists": false,
      },
      consoles: Object.fromEntries(
        Object.entries(this._consolesData).map(([, c]) => [
          c.name,
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
                    c["content-targets"].media.names.map((m) => [m, false]),
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
    const consolesToSkip = await populateConsoles(this._consoles);
    for (const consoleName of consolesToSkip)
      this._skipConsoleGlobal(consoleName);
  };

  filter: () => void = () => {
    filterConsoles(this.filterableConsoles);
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
      if (
        this._shouldProcessContentTargets.roms &&
        !this._skipFlags["content-targets"].roms
      ) {
        const [consolesToSkip, validationError] = await writeRomsLists(
          this._paths,
          this._consoleNames,
          this._fileIOExtras,
        );

        if (validationError) this._skipRomsContentTarget();

        if (consolesToSkip)
          for (const consoleName of consolesToSkip)
            this._skipConsoleRoms(consoleName);
      }

      if (
        this._shouldProcessContentTargets.media.global &&
        !this._skipFlags["content-targets"].media.global
      ) {
        const [consoleMediaNamesToSkip, validationError] =
          await writeMediaLists(
            this._paths,
            this._consolesData,
            this._fileIOExtras,
          );

        if (validationError) this._skipMediaContentTarget();

        if (consoleMediaNamesToSkip)
          for (const consoleMediaName of consoleMediaNamesToSkip)
            this._skipConsoleMediaName(
              consoleMediaName.console,
              consoleMediaName.media,
            );
      }
    },
    diffs: async () => {
      const consoleRoms: ConsoleRoms = {};

      for (const [, konsole] of this.filterableConsoles)
        consoleRoms[konsole.name] = {
          name: konsole.name,
          roms: {
            all: konsole.roms,
            selected: konsole.selectedRoms,
          },
        };

      if (
        this._shouldProcessContentTargets.roms &&
        !this._skipFlags["content-targets"].roms
      ) {
        const [consolesToSkip, validationError] = await writeRomsDiffs(
          this._paths,
          consoleRoms,
        );

        if (validationError) this._skipRomsContentTarget();

        if (consolesToSkip)
          for (const consoleName of consolesToSkip)
            this._skipConsoleRoms(consoleName);
      }

      if (
        this._shouldProcessContentTargets.media.global &&
        !this._skipFlags["content-targets"].media.global
      ) {
        const [consoleMediaNamesToSkip, validationError] =
          await writeMediaDiffs(this._paths, consoleRoms, this._consolesData);

        if (validationError) this._skipMediaContentTarget();

        if (consoleMediaNamesToSkip)
          for (const consoleMediaName of consoleMediaNamesToSkip)
            this._skipConsoleMediaName(
              consoleMediaName.console,
              consoleMediaName.media,
            );
      }
    },
  };

  sync: () => Promise<void> = async () => {};

  debug: () => string = () => {
    let content = "AlejandroG751JT { ";

    content += `name: ${this._name}, `;
    content += `content-targets: ${CONTENT_TARGET_NAMES.filter((c) => this._shouldProcessContentTargets[c] === true).join(", ")}, `;
    content += `console-names: ${this._consoleNames.join(",")}, `;
    content += `all-media-names: ${this._allMediaNames.join(", ")}, `;

    for (const [, consoleData] of Object.entries(this._consolesData))
      content += `${consoleData.name}-media-names: ${consoleData["content-targets"].media.names.join(", ")} `;

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
      [...this.filterableConsoles.entries()].filter(
        ([consoleName]) => !this._skipFlags.consoles[consoleName]!.sync.global,
      ),
    );
  }

  get romSyncableConsoles(): Consoles {
    return new Map(
      [...this.syncableConsoles.entries()].filter(
        ([consoleName]) =>
          !this._skipFlags.consoles[consoleName]!.sync["content-targets"].roms,
      ),
    );
  }

  get mediaSyncableConsoles(): Consoles {
    return new Map(
      [...this.syncableConsoles.entries()].filter(
        ([consoleName]) =>
          !this._skipFlags.consoles[consoleName]!.sync["content-targets"].media
            .global,
      ),
    );
  }

  public getMediaNameSyncableConsoles(mediaName: MediaName): Consoles {
    return new Map(
      [...this.mediaSyncableConsoles.entries()].filter(
        ([consoleName]) =>
          typeof this._skipFlags.consoles[consoleName]!.sync["content-targets"]
            .media.names[mediaName] === "boolean" &&
          !this._skipFlags.consoles[consoleName]!.sync["content-targets"].media
            .names[mediaName],
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
                  this._allMediaNames.map((m) => [
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
                  this._allMediaNames.map((m) => [
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
                  this._allMediaNames.map((m) => [
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
              Object.entries(this._consolesData).map(([, c]) => [
                c.name,
                {
                  base: path.join(contentTargetPaths.media, c.name),
                  names: Object.fromEntries(
                    c["content-targets"].media.names.map((m) => [
                      m,
                      path.join(contentTargetPaths.media, c.name, m),
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
            media: {
              consoles: Object.fromEntries(
                Object.entries(this._consolesData).map(([, c]) => [
                  c.name,
                  Object.fromEntries(
                    c["content-targets"].media.names.map((m) => [
                      m,
                      path.join(mediaListsDirPath, m, `${c.name}.list.txt`),
                    ]),
                  ) as Partial<MediaPaths>,
                ]),
              ) as Partial<ConsoleContent<Partial<MediaPaths>>>,
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
            media: {
              consoles: Object.fromEntries(
                Object.entries(this._consolesData).map(([, c]) => [
                  c.name,
                  Object.fromEntries(
                    c["content-targets"].media.names.map((m) => [
                      m,
                      path.join(mediaDiffsDirPath, m, `${c.name}.diff.txt`),
                    ]),
                  ) as Partial<MediaPaths>,
                ]),
              ) as Partial<ConsoleContent<Partial<MediaPaths>>>,
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
            media: {
              consoles: Object.fromEntries(
                Object.entries(this._consolesData).map(([, c]) => [
                  c.name,
                  Object.fromEntries(
                    c["content-targets"].media.names.map((m) => [
                      m,
                      path.join(mediaFailedDirPath, m, `${c.name}.failed.txt`),
                    ]),
                  ) as Partial<MediaPaths>,
                ]),
              ) as Partial<ConsoleContent<Partial<MediaPaths>>>,
            },
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
