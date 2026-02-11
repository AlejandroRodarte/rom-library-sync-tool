import {
  FS,
  SFTP,
} from "../../constants/file-io/file-io-strategies.constants.js";
import buildGenericDevicePathsUsingDefaultStrategy from "../../helpers/classes/devices/generic-device/build/paths/build-generic-device-paths-using-default-strategy.helper.js";
import writeEsDeGamelistsDiffs from "../../helpers/classes/devices/generic-device/diff/write-es-de-gamelists-diffs.helper.js";
import writeMediaDiffs from "../../helpers/classes/devices/generic-device/diff/write-media-diffs.helper.js";
import writeRomsDiffs from "../../helpers/classes/devices/generic-device/diff/write-roms-diffs.helper.js";
import writeEsDeGamelistsLists from "../../helpers/classes/devices/generic-device/list/write-es-de-gamelists-lists.helper.js";
import writeMediaLists from "../../helpers/classes/devices/generic-device/list/write-media-lists.helper.js";
import writeRomsLists from "../../helpers/classes/devices/generic-device/list/write-roms-lists.helper.js";
import writeDuplicateRomsFile from "../../helpers/classes/devices/generic-device/logs/write-duplicate-roms-file.helper.js";
import writeScrappedRomsFile from "../../helpers/classes/devices/generic-device/logs/write-scrapped-roms-file.helper.js";
import populateConsolesGamelists from "../../helpers/classes/devices/generic-device/populate/populate-consoles-gamelists.helper.js";
import populateConsolesGames from "../../helpers/classes/devices/generic-device/populate/populate-consoles-games.helper.js";
import populateConsolesMedias from "../../helpers/classes/devices/generic-device/populate/populate-consoles-medias.helper.js";
import syncEsDeGamelists from "../../helpers/classes/devices/generic-device/sync/sync-es-de-gamelists.helper.js";
import syncMedia from "../../helpers/classes/devices/generic-device/sync/sync-media.helper.js";
import syncRoms from "../../helpers/classes/devices/generic-device/sync/sync-roms.helper.js";
import filterConsolesGamesUsingDefaultStrategy from "../../helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy.helper.js";
import type { GenericDeviceOpts } from "../../interfaces/classes/devices/generic-device/generic-device-opts.interface.js";
import type { GenericDevicePaths } from "../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import type { Device } from "../../interfaces/device.interface.js";
import type { Environment } from "../../interfaces/env/environment.interface.js";
import type {
  ConnectMethodError as FileIOConnectMethodError,
  FileIO,
  DisconnectMethodError as FileIODisconnectMethodError,
} from "../../interfaces/file-io.interface.js";
import logger from "../../objects/logger.object.js";
import type { ConsoleName } from "../../types/consoles/console-name.type.js";
import type { Consoles } from "../../types/consoles/consoles.type.js";
import type { ContentTargetContent } from "../../types/content-targets/content-target-content.type.js";
import type { DeepPartial } from "../../types/deep-partial.type.js";
import type { RomTitleNameBuildStrategy } from "../../types/roms/rom-title-name-build-strategy.type.js";
import ConsoleMetadata from "../entities/console-metadata.class.js";
import Console from "../entities/console.class.js";
import FileIOExtras from "../file-io/file-io-extras.class.js";
import Fs from "../file-io/fs.class.js";
import Sftp from "../file-io/sftp.class.js";
import SftpClient from "../sftp/sftp-client.class.js";

const fsExtras = {
  writeDuplicateRomsFile,
  writeScrappedRomsFile,
};

export type BuildStaticMethodError = FileIOConnectMethodError;

class GenericDevice implements Device, Debug {
  private _name: string;
  private _opts: GenericDeviceOpts;
  private _paths: GenericDevicePaths;
  private _consoles: Consoles;
  private _contentTargetSkipFlags: ContentTargetContent<boolean>;
  private _titleNameBuildStrategy: RomTitleNameBuildStrategy;
  private _fileIOExtras: FileIOExtras;

  public constructor(
    name: string,
    envData: Environment["device"]["data"][string],
    opts?: DeepPartial<GenericDeviceOpts>,
  ) {
    this._name = name;
    this._titleNameBuildStrategy =
      envData.generic.populate.games.titleName.strategy;

    this._opts = {
      build: {
        paths: {
          deviceEnvDataToGenericDevicePathsFn:
            buildGenericDevicePathsUsingDefaultStrategy,
        },
      },
      filter: {
        roms: {
          consolesGamesFilterFn: filterConsolesGamesUsingDefaultStrategy,
        },
      },
    };

    if (opts?.build?.paths?.deviceEnvDataToGenericDevicePathsFn)
      this._opts.build.paths.deviceEnvDataToGenericDevicePathsFn =
        opts.build.paths.deviceEnvDataToGenericDevicePathsFn;
    if (opts?.filter?.roms?.consolesGamesFilterFn)
      this._opts.filter.roms.consolesGamesFilterFn =
        opts.filter.roms.consolesGamesFilterFn;

    this._paths = this._opts.build.paths.deviceEnvDataToGenericDevicePathsFn(
      this._name,
      envData,
    );

    let fileIO: FileIO;

    switch (envData.generic.fileIO.strategy.name) {
      case FS:
        fileIO = new Fs(envData.generic.fileIO.strategy.data.fs.crud.strategy);
        break;
      case SFTP:
        fileIO = new Sftp(
          new SftpClient(
            this._name,
            envData.generic.fileIO.strategy.data.sftp.credentials,
          ),
        );
        break;
    }

    this._fileIOExtras = new FileIOExtras(fileIO);

    this._consoles = new Map<ConsoleName, Console>();
    for (const [, consoleEnvData] of Object.entries(envData.generic.consoles)) {
      const newConsole = new Console(
        consoleEnvData.name,
        new ConsoleMetadata(consoleEnvData["content-targets"].media.names),
      );
      this._consoles.set(consoleEnvData.name, newConsole);
    }

    const uniqueContentTargetNames = [
      ...new Set(envData.generic["content-targets"].names),
    ];

    this._contentTargetSkipFlags = {
      roms: !uniqueContentTargetNames.includes("roms"),
      media: !uniqueContentTargetNames.includes("media"),
      "es-de-gamelists": !uniqueContentTargetNames.includes("es-de-gamelists"),
    };

    logger.debug(this.debug());
  }

  connect: () => Promise<FileIOConnectMethodError | undefined> = async () => {
    return await this._fileIOExtras.fileIO.connect();
  };

  disconnect: () => Promise<FileIODisconnectMethodError | undefined> =
    async () => {
      return await this._fileIOExtras.fileIO.disconnect();
    };

  name: () => string = () => {
    return this._name;
  };

  consoles: () => Consoles = () => {
    return this._consoles;
  };

  populate: () => Promise<void> = async () => {
    if (this._titleNameBuildStrategy === "es-de-gamelist-name")
      await populateConsolesGamelists(this._consoles);

    await populateConsolesGames(this._consoles, this._titleNameBuildStrategy);

    if (!this._contentTargetSkipFlags.media)
      await populateConsolesMedias(this._consoles);

    if (
      !this._contentTargetSkipFlags["es-de-gamelists"] &&
      this._titleNameBuildStrategy !== "es-de-gamelist-name"
    )
      await populateConsolesGamelists(this._consoles);
  };

  filter: () => void = () => {
    this._opts.filter.roms.consolesGamesFilterFn(this._consoles);
  };

  write = {
    lists: async () => {
      if (!this._contentTargetSkipFlags.roms) {
        const pathsValidationError = await writeRomsLists(
          this._paths,
          this._consoles,
          this._fileIOExtras,
        );
        if (pathsValidationError) this._skipRomsContentTarget();
      }

      if (!this._contentTargetSkipFlags.media) {
        const pathsValidationError = await writeMediaLists(
          this._paths,
          this._consoles,
          this._fileIOExtras,
        );
        if (pathsValidationError) this._skipMediaContentTarget();
      }

      if (!this._contentTargetSkipFlags["es-de-gamelists"]) {
        const pathsValidationError = await writeEsDeGamelistsLists(
          this._paths,
          this._consoles,
          this._fileIOExtras,
        );
        if (pathsValidationError) this._skipEsDeGamelistsContentTarget();
      }
    },
    diffs: async () => {
      if (!this._contentTargetSkipFlags.roms) {
        const pathsValidationError = await writeRomsDiffs(
          this._paths,
          this._consoles,
        );
        if (pathsValidationError) this._skipRomsContentTarget();

        const writeDuplicatesError = await fsExtras.writeDuplicateRomsFile(
          this._consoles,
          this._paths.files.project.logs.duplicates,
        );
        if (writeDuplicatesError) logger.error(writeDuplicatesError.toString());

        const writeScrappedError = await fsExtras.writeScrappedRomsFile(
          this._consoles,
          this._paths.files.project.logs.scrapped,
        );
        if (writeScrappedError) logger.error(writeScrappedError.toString());
      }

      if (!this._contentTargetSkipFlags.media) {
        const pathsValidationError = await writeMediaDiffs(
          this._paths,
          this._consoles,
        );
        if (pathsValidationError) this._skipMediaContentTarget();
      }

      if (!this._contentTargetSkipFlags["es-de-gamelists"]) {
        const pathsValidationError = await writeEsDeGamelistsDiffs(
          this._paths,
          this._consoles,
        );
        if (pathsValidationError) this._skipEsDeGamelistsContentTarget();
      }
    },
  };

  sync: () => Promise<void> = async () => {
    if (!this._contentTargetSkipFlags.roms) {
      const pathsValidationError = await syncRoms(
        this._paths,
        this._consoles,
        this._fileIOExtras,
      );
      if (pathsValidationError) this._skipRomsContentTarget();
    }

    if (!this._contentTargetSkipFlags.media) {
      const pathsValidationError = await syncMedia(
        this._paths,
        this._consoles,
        this._fileIOExtras,
      );
      if (pathsValidationError) this._skipMediaContentTarget();
    }

    if (!this._contentTargetSkipFlags["es-de-gamelists"]) {
      const pathsValidationError = await syncEsDeGamelists(
        this._paths,
        this._consoles,
        this._fileIOExtras,
      );
      if (pathsValidationError) this._skipEsDeGamelistsContentTarget();
    }
  };

  debug: () => string = () => {
    let content = `${this._name} { `;

    content += `name: ${this._name}, `;
    content += `content-targets: ${Object.entries(this._contentTargetSkipFlags)
      .filter(([, skip]) => !skip)
      .map(([c]) => c)
      .join(", ")}, `;

    for (const [, konsole] of this._consoles)
      content += `${konsole.name}-media-names: ${konsole.metadata.mediaNames.join(", ")} `;

    content += "}";
    return content;
  };

  private _skipRomsContentTarget() {
    this._contentTargetSkipFlags.roms = true;
  }

  private _skipMediaContentTarget() {
    this._contentTargetSkipFlags.media = true;
  }

  private _skipEsDeGamelistsContentTarget() {
    this._contentTargetSkipFlags["es-de-gamelists"] = true;
  }
}

export default GenericDevice;
