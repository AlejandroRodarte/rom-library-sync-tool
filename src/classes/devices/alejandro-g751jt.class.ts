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
import type { MediaName } from "../../types/media-name.type.js";
import type { MediaPaths } from "../../types/media-paths.type.js";
import writeDuplicateRomsFile from "../../helpers/extras/fs/write-duplicate-roms-file.helper.js";
import writeScrappedRomsFile from "../../helpers/extras/fs/write-scrapped-roms-file.helper.js";
import writeToFileOrDelete from "../../helpers/extras/fs/write-to-file-or-delete.helper.js";
import deleteAndOpenWriteOnlyFile from "../../helpers/extras/fs/delete-and-open-new-write-only-file.helper.js";
import writeConsoleDiffFile from "../../helpers/extras/fs/write-console-diff-file.helper.js";
import FileIOExtras from "../file-io/file-io-extras.class.js";
import dirExists from "../../helpers/extras/fs/dir-exists.helper.js";
import allDirsExist from "../../helpers/extras/fs/all-dirs-exist.helper.js";
import writeRomsLists from "../../helpers/classes/devices/alejandro-g751jt/write-roms-lists.helper.js";
import type { ConsolesData } from "../../types/consoles-data.type.js";
import writeMediaLists from "../../helpers/classes/devices/alejandro-g751jt/write-media-lists.helper.js";
import populateConsoles from "../../helpers/classes/devices/alejandro-g751jt/populate-consoles.helper.js";
import filterConsoles from "../../helpers/classes/devices/alejandro-g751jt/filter-consoles.helper.js";
import writeRomsDiffs from "../../helpers/classes/devices/alejandro-g751jt/write-roms-diffs.helper.js";
import type { ConsoleRoms } from "../../types/console-roms.type.js";
import writeMediaDiffs from "../../helpers/classes/devices/alejandro-g751jt/write-media-diffs.helper.js";
import type { ContentTargetContent } from "../../types/content-target-content.type.js";
import buildConsolesSkipFlags from "../../helpers/classes/devices/alejandro-g751jt/build-consoles-skip-flags.helper.js";

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

  private _contentTargetSkipFlags: ContentTargetContent<boolean>;
  private _fileIOExtras: FileIOExtras;

  constructor(
    envData: Environment["device"]["data"][typeof ALEJANDRO_G751JT],
    fileIO: FileIO,
  ) {
    this._consolesData = {};

    for (const [, c] of Object.entries(envData.consoles))
      this._consolesData[c.name] = {
        name: c.name,
        "content-targets": c["content-targets"],
        skipFlags: buildConsolesSkipFlags(c["content-targets"].media.names),
      };

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

    this._contentTargetSkipFlags = {
      roms: !uniqueContentTargetNames.includes("roms"),
      media: !uniqueContentTargetNames.includes("media"),
      "es-de-gamelists": !uniqueContentTargetNames.includes("es-de-gamelists"),
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
    filterConsoles(this._consoles);
  };

  write: DeviceWriteMethods = {
    duplicates: async () => {
      const writeError = await fsExtras.writeDuplicateRomsFile(
        this._consoles,
        this._paths.files.project.logs.duplicates,
      );
      if (writeError) logger.error(writeError.toString());
    },
    scrapped: async () => {
      const writeError = await fsExtras.writeScrappedRomsFile(
        this._consoles,
        this._paths.files.project.logs.scrapped,
      );
      if (writeError) logger.error(writeError.toString());
    },
    lists: async () => {
      if (!this._contentTargetSkipFlags.roms) {
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

      if (!this._contentTargetSkipFlags.media) {
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

      for (const [, konsole] of this._consoles)
        consoleRoms[konsole.name] = {
          name: konsole.name,
          roms: {
            all: konsole.roms,
            selected: konsole.selectedRoms,
          },
        };

      if (!this._contentTargetSkipFlags.roms) {
        const [consolesToSkip, validationError] = await writeRomsDiffs(
          this._paths,
          consoleRoms,
        );

        if (validationError) this._skipRomsContentTarget();

        if (consolesToSkip)
          for (const consoleName of consolesToSkip)
            this._skipConsoleRoms(consoleName);
      }

      if (!this._contentTargetSkipFlags.media) {
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
    failed: async () => {},
  };

  sync: () => Promise<void> = async () => {};

  debug: () => string = () => {
    let content = "AlejandroG751JT { ";

    content += `name: ${this._name}, `;
    content += `content-targets: ${Object.entries(this._contentTargetSkipFlags)
      .filter(([, skip]) => !skip)
      .map(([c]) => c)
      .join(", ")}, `;
    content += `console-names: ${this._consoleNames.join(",")}, `;
    content += `all-media-names: ${this._allMediaNames.join(", ")}, `;

    for (const [, consoleData] of Object.entries(this._consolesData))
      content += `${consoleData.name}-media-names: ${consoleData["content-targets"].media.names.join(", ")} `;

    content += "}";

    return content;
  };

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
    if (this._consolesData[consoleName]) {
      this._consolesData[consoleName].skipFlags.global = true;
      this._consolesData[consoleName].skipFlags.list.global = true;
      this._consolesData[consoleName].skipFlags.diff.global = true;
      this._consolesData[consoleName].skipFlags.sync.global = true;
    }
  }

  private _skipConsoleRoms(consoleName: ConsoleName) {
    if (this._consolesData[consoleName])
      this._consolesData[consoleName].skipFlags.sync["content-targets"].roms =
        true;
  }

  private _skipConsoleMediaName(
    consoleName: ConsoleName,
    mediaName: MediaName,
  ) {
    if (this._consolesData[consoleName]) {
      if (
        typeof this._consolesData[consoleName].skipFlags.sync["content-targets"]
          .media.names[mediaName] === "boolean"
      )
        this._consolesData[consoleName].skipFlags.sync[
          "content-targets"
        ].media.names[mediaName] = false;
    }
  }

  private _skipRomsContentTarget() {
    this._contentTargetSkipFlags.roms = true;
  }

  private _skipMediaContentTarget() {
    this._contentTargetSkipFlags.media = true;
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
