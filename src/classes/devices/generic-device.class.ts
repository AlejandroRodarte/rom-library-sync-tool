import type { Device } from "../../interfaces/device.interface.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { Consoles } from "../../types/consoles.type.js";
import Console from "../console.class.js";
import logger from "../../objects/logger.object.js";
import type { DeviceWriteMethods } from "../../interfaces/device-write-methods.interface.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import type { FileIO } from "../../interfaces/file-io.interface.js";
import writeDuplicateRomsFile from "../../helpers/extras/fs/write-duplicate-roms-file.helper.js";
import writeScrappedRomsFile from "../../helpers/extras/fs/write-scrapped-roms-file.helper.js";
import FileIOExtras from "../file-io/file-io-extras.class.js";
import writeRomsLists from "../../helpers/classes/devices/generic-device/write-roms-lists.helper.js";
import writeMediaLists from "../../helpers/classes/devices/generic-device/write-media-lists.helper.js";
import populateConsolesGames from "../../helpers/classes/devices/generic-device/populate-consoles-games.helper.js";
import filterConsolesGames from "../../helpers/classes/devices/generic-device/filter-consoles-games.helper.js";
import writeRomsDiffs from "../../helpers/classes/devices/generic-device/write-roms-diffs.helper.js";
import writeMediaDiffs from "../../helpers/classes/devices/generic-device/write-media-diffs.helper.js";
import type { ContentTargetContent } from "../../types/content-target-content.type.js";
import writeEsDeGamelistsLists from "../../helpers/classes/devices/generic-device/write-es-de-gamelists-lists.helper.js";
import populateConsolesMedias from "../../helpers/classes/devices/generic-device/populate-consoles-medias.helper.js";
import ConsoleMetadata from "../console-metadata.class.js";
import type { ContentTargetPaths } from "../../types/content-target-paths.type.js";
import buildPaths from "../../helpers/classes/devices/generic-device/build-paths.helper.js";
import type { DeviceConsolesEnvData } from "../../types/device-consoles-env-data.type.js";
import populateConsolesGamelists from "../../helpers/classes/devices/generic-device/populate-consoles-gamelists.helper.js";
import writeEsDeGamelistsDiffs from "../../helpers/classes/devices/generic-device/write-es-de-gamelists-diffs.helper.js";
import syncRoms from "../../helpers/classes/devices/generic-device/sync-roms.helper.js";
import syncMedia from "../../helpers/classes/devices/generic-device/sync-media.helper.js";
import syncEsDeGamelists from "../../helpers/classes/devices/generic-device/sync-es-de-gamelists.helper.js";
import type { GenericDevicePaths } from "../../interfaces/devices/generic-device/generic-device-paths.interface.js";
import type { DeviceEnvData } from "../../interfaces/devices/generic-device/device-env-data.interface.js";
import Fs from "../file-io/fs.class.js";
import Sftp from "../file-io/sftp.class.js";
import SftpClient from "../sftp-client.class.js";

const fsExtras = {
  writeDuplicateRomsFile,
  writeScrappedRomsFile,
};

class GenericDevice implements Device, Debug {
  private _name: string;
  private _paths: GenericDevicePaths;
  private _consoles: Consoles;
  private _contentTargetSkipFlags: ContentTargetContent<boolean>;
  private _fileIOExtras: FileIOExtras;

  constructor(name: string, envData: DeviceEnvData) {
    this._name = name;
    this._paths = this._buildGenericDevicePaths(
      envData.consoles,
      envData["content-targets"].paths,
    );

    let fileIO: FileIO;

    switch (envData.fileIO.strategy.name) {
      case "fs":
        fileIO = new Fs(envData.fileIO.strategy.data.fs.crud.strategy);
        break;
      case "sftp":
        fileIO = new Sftp(
          new SftpClient(
            this._name,
            envData.fileIO.strategy.data.sftp.credentials,
          ),
        );
        break;
    }

    this._fileIOExtras = new FileIOExtras(fileIO);

    this._consoles = new Map<ConsoleName, Console>();
    for (const [, consoleEnvData] of Object.entries(envData.consoles)) {
      const newConsole = new Console(
        consoleEnvData.name,
        new ConsoleMetadata(consoleEnvData["content-targets"].media.names),
      );
      this._consoles.set(consoleEnvData.name, newConsole);
    }

    const uniqueContentTargetNames = [
      ...new Set(envData["content-targets"].names),
    ];

    this._contentTargetSkipFlags = {
      roms: !uniqueContentTargetNames.includes("roms"),
      media: !uniqueContentTargetNames.includes("media"),
      "es-de-gamelists": !uniqueContentTargetNames.includes("es-de-gamelists"),
    };

    logger.debug(this.debug());
  }

  name: () => string = () => {
    return this._name;
  };

  consoles: () => Consoles = () => {
    return this._consoles;
  };

  populate: () => Promise<void> = async () => {
    await populateConsolesGames(this._consoles);
    if (!this._contentTargetSkipFlags.media)
      await populateConsolesMedias(this._consoles);
    if (!this._contentTargetSkipFlags["es-de-gamelists"])
      await populateConsolesGamelists(this._consoles);
  };

  filter: () => void = () => {
    filterConsolesGames(this._consoles);
  };

  write: DeviceWriteMethods = {
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
    let content = "AlejandroG751JT { ";

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

  private _buildGenericDevicePaths(
    consolesEnvData: DeviceConsolesEnvData,
    contentTargetPaths: ContentTargetPaths,
  ): GenericDevicePaths {
    return buildPaths(this._name, consolesEnvData, contentTargetPaths);
  }
}

export default GenericDevice;
