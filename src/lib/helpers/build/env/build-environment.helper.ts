import path from "node:path";
import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import ALL_CONTENT_TARGET_NAMES from "../../../constants/content-targets/all-content-target-names.constant.js";
import ALL_LOG_LEVELS from "../../../constants/log/all-log-levels.constant.js";
import ALL_MODE_NAMES from "../../../constants/modes/all-mode-names.constant.js";
import type { Environment } from "../../../interfaces/env/environment.interface.js";
import type { JsonRawEnvironment } from "../../../interfaces/env/json-raw-environment.interface.js";
import typeGuards from "../../typescript/guards/index.js";
import validation from "../../validation/index.js";
import ALL_FILE_IO_STRATEGIES from "../../../constants/file-io/all-file-io-strategies.constant.js";
import ALL_FILE_IO_FS_CRUD_STRATEGIES from "../../../constants/file-io/all-file-io-fs-crud-strategies.constant.js";
import buildDeviceConsolesEnvDataFromModes from "./build-device-consoles-env-data-from-modes.helper.js";
import deviceNamesFromModes from "./build-device-names-from-modes.helper.js";
import buildDeviceNamesFromRawValue from "./build-device-names-from-raw-value.helper.js";
import buildConsoleNamesFromRawValue from "./build-console-names-from-raw-value.helper.js";
import buildContentTargetNamesFromRawValue from "./build-content-target-names-from-raw-value.helper.js";
import ALL_ROM_TITLE_NAME_BUILD_STRATEGIES from "../../../constants/roms/all-rom-title-name-build-strategies.constant.js";
import type { ContentTargetName } from "../../../types/content-targets/content-target-name.type.js";
import buildContentTargetNamesFromModes from "./build-content-target-names-from-modes.helper.js";
import readFileSync from "../../wrappers/modules/fs/read-file-sync.helper.js";
import { DATA_DIR_PATH } from "../../../constants/paths.constants.js";
import isStringArrayASubset from "../../validation/is-string-array-a-subset.helper.js";
import buildConsolesMediaNamesFromRawValue from "./build-consoles-media-names-from-raw-value.helper.js";
import ALL_MEDIA_NAMES from "../../../constants/media/all-media-names.constant.js";
import AppNotFoundError from "../../../classes/errors/app-not-found-error.class.js";
import type { GenericDeviceConsolesDataEnvData } from "../../../types/classes/devices/generic-device/env/generic-device-consoles-data-env-data.type.js";

const buildEnvironment = (): Environment => {
  const [environmentFileRawContent, readFileError] = readFileSync(
    path.join(DATA_DIR_PATH, "environment.json"),
    "utf8",
  );
  if (readFileError) throw readFileError;

  const jsonRawEnvironment: JsonRawEnvironment = JSON.parse(
    environmentFileRawContent.toString(),
  );

  /**
   * options.log.level
   **/
  const logLevel = jsonRawEnvironment.options.log.level.toUpperCase();
  if (!typeGuards.isLogLevel(logLevel))
    throw new AppValidationError(
      `${logLevel} is not a valid log level. Please choose one from the following: ${ALL_LOG_LEVELS.join(", ")}.`,
    );

  /**
   * options.mode
   **/
  const mode = jsonRawEnvironment.options.mode;
  if (!typeGuards.isModeName(mode))
    throw new AppValidationError(
      `${mode} is an invalid mode. Please choose one from the following: ${ALL_MODE_NAMES.join(", ")}.`,
    );

  /**
   * options.simulate.sync
   **/
  const simulateSync = jsonRawEnvironment.options.simulate.sync;

  /**
   * database.paths
   **/
  const databasePaths = jsonRawEnvironment.database.paths;
  if (!typeGuards.isContentTargetPaths(databasePaths))
    throw new AppValidationError(
      `Database paths can only be related to content target names: ${ALL_CONTENT_TARGET_NAMES.join(", ")}.`,
    );
  for (const path of Object.values(databasePaths))
    if (!validation.isStringAbsoluteUnixPath(path))
      throw new AppValidationError(
        `String ${path} must be an absolute UNIX path.`,
      );

  /**
   * device.data.keys
   **/
  const dataDeviceNames = Object.keys(jsonRawEnvironment.device.data);

  /**
   * device.names.list
   **/
  const officialDeviceNames = jsonRawEnvironment.device.names.list;

  if (!isStringArrayASubset(dataDeviceNames, officialDeviceNames))
    throw new AppValidationError(
      `You provided data for the following devices: ${dataDeviceNames.join(", ")}. However, you are telling the program that "${officialDeviceNames.join(", ")}" is the official list of devices you want to work with. Please make your "official" device list a subset of the device list you actually provide data for.`,
    );

  /**
   * device.names.modes.list
   */
  const rawListDeviceNames = jsonRawEnvironment.device.names.modes.list;
  const [listDeviceNames, listDeviceNamesValidationError] =
    buildDeviceNamesFromRawValue(rawListDeviceNames, officialDeviceNames);
  if (listDeviceNamesValidationError) throw listDeviceNamesValidationError;

  /**
   * device.names.modes.diff
   **/
  const rawDiffDeviceNames = jsonRawEnvironment.device.names.modes.diff;
  const [diffDeviceNames, diffDeviceNamesValidationError] =
    buildDeviceNamesFromRawValue(rawDiffDeviceNames, officialDeviceNames);
  if (diffDeviceNamesValidationError) throw diffDeviceNamesValidationError;

  /**
   * device.names.modes.sync
   **/
  const rawSyncDeviceNames = jsonRawEnvironment.device.names.modes.sync;
  const [syncDeviceNames, syncDeviceNamesValidationError] =
    buildDeviceNamesFromRawValue(rawSyncDeviceNames, officialDeviceNames);
  if (syncDeviceNamesValidationError) throw syncDeviceNamesValidationError;

  /**
   * devices data object
   **/
  const devicesData: Environment["device"]["data"] = {};

  /**
   * device.data["<device-name>"]
   **/
  for (const officialDeviceName of officialDeviceNames) {
    console.log(`processing device ${officialDeviceName}`);
    const deviceData = jsonRawEnvironment.device.data[officialDeviceName];

    if (!deviceData)
      throw new AppNotFoundError(
        `Data absent for device ${officialDeviceName}. This should be unreachable.`,
      );

    /**
     * device.populate.games.titleName.build.strategy.name
     **/
    const titleNameBuildStrategyName =
      deviceData.populate.games.titleName.build.strategy.name;
    if (!typeGuards.isRomTitleNameBuildStrategy(titleNameBuildStrategyName))
      throw new AppValidationError(
        `${titleNameBuildStrategyName} is not a valid strategy to build ROM title names. Please choose one of the following: ${ALL_ROM_TITLE_NAME_BUILD_STRATEGIES.join(", ")}.`,
      );

    /**
     * device.data["<device-name>"].console.names.list
     **/
    const rawConsoleNames = deviceData.consoles.names.list;
    const [consoleNames, consoleNamesValidationError] =
      buildConsoleNamesFromRawValue(rawConsoleNames);
    if (consoleNamesValidationError) throw consoleNamesValidationError;

    /**
     * device.data["<device-name>"].consoles.names.modes.list
     **/
    const rawListConsoleNames = deviceData.consoles.names.modes.list;
    const [listConsoleNames, listConsoleNamesValidationError] =
      buildConsoleNamesFromRawValue(rawListConsoleNames, consoleNames);
    if (listConsoleNamesValidationError) throw listConsoleNamesValidationError;

    /**
     * device.data["<device-name>"].consoles.names.modes.diff
     **/
    const rawDiffConsoleNames = deviceData.consoles.names.modes.diff;
    const [diffConsoleNames, diffConsoleNamesValidationError] =
      buildConsoleNamesFromRawValue(rawDiffConsoleNames, listConsoleNames);
    if (diffConsoleNamesValidationError) throw diffConsoleNamesValidationError;

    /**
     * device.data["<device-name>"].consoles.names.modes.sync
     **/
    const rawSyncConsoleNames = deviceData.consoles.names.modes.sync;
    const [syncConsoleNames, syncConsoleNamesValidationError] =
      buildConsoleNamesFromRawValue(rawSyncConsoleNames, diffConsoleNames);
    if (syncConsoleNamesValidationError) throw syncConsoleNamesValidationError;

    /**
     * device's consoles environment data for list mode
     **/
    const listConsolesEnvData: GenericDeviceConsolesDataEnvData = {};
    for (const listConsoleName of listConsoleNames)
      listConsolesEnvData[listConsoleName] = {
        name: listConsoleName,
        "content-targets": {
          media: {
            names: [],
          },
        },
      };

    /**
     * device's consoles environment data for diff mode
     **/
    const diffConsolesEnvData: GenericDeviceConsolesDataEnvData = {};
    for (const diffConsoleName of diffConsoleNames)
      diffConsolesEnvData[diffConsoleName] = {
        name: diffConsoleName,
        "content-targets": {
          media: {
            names: [],
          },
        },
      };

    /**
     * device's consoles environment data for sync mode
     **/
    const syncConsolesEnvData: GenericDeviceConsolesDataEnvData = {};
    for (const syncConsoleName of syncConsoleNames)
      syncConsolesEnvData[syncConsoleName] = {
        name: syncConsoleName,
        "content-targets": {
          media: {
            names: [],
          },
        },
      };

    /**
     * device.data["<device-name>"].consoles.media.list
     **/
    const rawConsolesMediaNames = deviceData.consoles.media.list;
    const [consolesMediaNames, buildConsolesMediaNamesValidationError] =
      buildConsolesMediaNamesFromRawValue(
        rawConsolesMediaNames,
        new Map(consoleNames.map((c) => [c, [...ALL_MEDIA_NAMES]])),
      );
    if (buildConsolesMediaNamesValidationError)
      throw buildConsolesMediaNamesValidationError;

    /**
     * device.data["<device-name>"].consoles.media.modes.list
     **/
    const rawListConsolesMediaNames = deviceData.consoles.media.modes.list;
    const [listConsolesMediaNames, buildListConsolesMediaNamesValidationError] =
      buildConsolesMediaNamesFromRawValue(
        rawListConsolesMediaNames,
        consolesMediaNames,
      );
    if (buildListConsolesMediaNamesValidationError)
      throw buildListConsolesMediaNamesValidationError;

    for (const [
      listConsoleName,
      listConsoleMediaNames,
    ] of listConsolesMediaNames)
      if (listConsolesEnvData[listConsoleName])
        listConsolesEnvData[listConsoleName]["content-targets"].media.names =
          listConsoleMediaNames;

    /**
     * device.data["<device-name>"].consoles.media.modes.diff
     **/
    const rawDiffConsolesMediaNames = deviceData.consoles.media.modes.diff;
    const [diffConsolesMediaNames, buildDiffConsolesMediaNamesValidationError] =
      buildConsolesMediaNamesFromRawValue(
        rawDiffConsolesMediaNames,
        listConsolesMediaNames,
      );
    if (buildDiffConsolesMediaNamesValidationError)
      throw buildDiffConsolesMediaNamesValidationError;

    for (const [
      diffConsoleName,
      diffConsoleMediaNames,
    ] of diffConsolesMediaNames)
      if (diffConsolesEnvData[diffConsoleName])
        diffConsolesEnvData[diffConsoleName]["content-targets"].media.names =
          diffConsoleMediaNames;

    /**
     * device.data["<device-name>"].consoles.media.modes.sync
     **/
    const rawSyncConsolesMediaNames = deviceData.consoles.media.modes.sync;
    const [syncConsolesMediaNames, buildSyncConsolesMediaNamesValidationError] =
      buildConsolesMediaNamesFromRawValue(
        rawSyncConsolesMediaNames,
        diffConsolesMediaNames,
      );
    if (buildSyncConsolesMediaNamesValidationError)
      throw buildSyncConsolesMediaNamesValidationError;

    for (const [
      syncConsoleName,
      syncConsoleMediaNames,
    ] of syncConsolesMediaNames)
      if (syncConsolesEnvData[syncConsoleName])
        syncConsolesEnvData[syncConsoleName]["content-targets"].media.names =
          syncConsoleMediaNames;

    /**
     * device.data["<device-name>"]["content-targets"].names.list
     **/
    const rawOfficialContentTargetNames =
      deviceData["content-targets"].names.list;
    const [
      officialContentTargetNames,
      officialContentTargetNamesValidationError,
    ] = buildContentTargetNamesFromRawValue(rawOfficialContentTargetNames);
    if (officialContentTargetNamesValidationError)
      throw officialContentTargetNamesValidationError;

    /**
     * device.data["<device-name>"]["content-targets"].names.modes.list
     **/
    const rawListContentTargetNames =
      deviceData["content-targets"].names.modes.list;
    const [listContentTargetNames, listContentTargetNamesValidationError] =
      buildContentTargetNamesFromRawValue(
        rawListContentTargetNames,
        officialContentTargetNames,
      );
    if (listContentTargetNamesValidationError)
      throw listContentTargetNamesValidationError;

    /**
     * device.data["<device-name>"]["content-targets"].names.modes.diff
     **/
    const rawDiffContentTargetNames =
      deviceData["content-targets"].names.modes.diff;
    const [diffContentTargetNames, diffContentTargetNamesValidationError] =
      buildContentTargetNamesFromRawValue(
        rawDiffContentTargetNames,
        listContentTargetNames,
      );
    if (diffContentTargetNamesValidationError)
      throw diffContentTargetNamesValidationError;

    /**
     * device.data["<device-name>"]["content-targets"].names.modes.sync
     **/
    const rawSyncContentTargetNames =
      deviceData["content-targets"].names.modes.sync;
    const [syncContentTargetNames, syncContentTargetNamesValidationError] =
      buildContentTargetNamesFromRawValue(
        rawSyncContentTargetNames,
        diffContentTargetNames,
      );
    if (syncContentTargetNamesValidationError)
      throw syncContentTargetNamesValidationError;

    /**
     * device.data["<device-name>"]["content-targets"].paths
     **/
    const contentTargetPaths = deviceData["content-targets"].paths;
    if (!typeGuards.isContentTargetPaths(contentTargetPaths))
      throw new AppValidationError(
        `Device paths can only be related to content target names: ${ALL_CONTENT_TARGET_NAMES.join(", ")}.`,
      );
    for (const path of Object.values(contentTargetPaths))
      if (!validation.isStringAbsoluteUnixPath(path))
        throw new AppValidationError(
          `String ${path} must be an absolute UNIX path.`,
        );

    /**
     * device.data["<device-name>"].fileIO.strategy.name
     **/
    const fileIOStrategyName = deviceData.fileIO.strategy.name;
    if (!typeGuards.isFileIOStrategy(fileIOStrategyName))
      throw new AppValidationError(
        `Invalid File IO strategy ${fileIOStrategyName}. Please choose one of the following: ${ALL_FILE_IO_STRATEGIES.join(", ")}.`,
      );

    /**
     * device.data["<device-name>"].fileIO.strategy.data.fs.crud.strategy.name
     **/
    const fileIOFsCrudStrategyName =
      deviceData.fileIO.strategy.data.fs.crud.strategy.name;
    if (!typeGuards.isFileIOFsCrudStrategy(fileIOFsCrudStrategyName))
      throw new AppValidationError(
        `Invalid File IO Fs strategy ${fileIOFsCrudStrategyName}. Please choose one of the following: ${ALL_FILE_IO_FS_CRUD_STRATEGIES.join(", ")}.`,
      );

    /**
     * device.data["<device-name>"].fileIO.strategy.data.sftp.credentials.host
     **/
    const fileIOSftpHostCredential =
      deviceData.fileIO.strategy.data.sftp.credentials.host;
    if (!validation.isStringIpv4Address(fileIOSftpHostCredential))
      throw new AppValidationError(
        `SFTP Host ${fileIOSftpHostCredential} must be a valid IPv34 address.`,
      );

    /**
     * device.data["<device-name>"].fileIO.strategy.data.sftp.credentials.port
     **/
    const rawFileIOSftpPortCredential =
      deviceData.fileIO.strategy.data.sftp.credentials.port;
    if (!validation.isStringPort(rawFileIOSftpPortCredential))
      throw new AppValidationError(
        `SFTP Port ${rawFileIOSftpPortCredential} must be an integer between 1 and 65535.`,
      );
    const fileIOSftpPortCredential = +rawFileIOSftpPortCredential;

    /**
     * device.data["<device-name>"].fileIO.strategy.data.sftp.credentials.username
     **/
    const fileIOSftpUsernameCredential =
      deviceData.fileIO.strategy.data.sftp.credentials.username;

    /**
     * device.data["<device-name>"].fileIO.strategy.data.sftp.credentials.password.env.key
     **/
    const fileIOSftpPasswordCredentialEnvKey =
      deviceData.fileIO.strategy.data.sftp.credentials.password.env.key;
    const fileIOSftpPasswordCredential =
      process.env[fileIOSftpPasswordCredentialEnvKey];
    if (!fileIOSftpPasswordCredential)
      throw new AppValidationError(
        `Please provide an SFTP password via environment variable ${fileIOSftpPasswordCredentialEnvKey}.`,
      );

    /**
     * computed environment variables
     **/

    /**
     * filtered content target names, depending on mode
     **/
    const contentTargetNames: ContentTargetName[] =
      buildContentTargetNamesFromModes(mode, {
        list: listContentTargetNames,
        diff: diffContentTargetNames,
        sync: syncContentTargetNames,
      });

    /**
     * filtered device consoles env data, depending on mode
     **/
    const deviceConsolesEnvData: GenericDeviceConsolesDataEnvData =
      buildDeviceConsolesEnvDataFromModes(mode, {
        list: listConsolesEnvData,
        diff: diffConsolesEnvData,
        sync: syncConsolesEnvData,
      });

    devicesData[officialDeviceName] = {
      generic: {
        populate: {
          games: {
            titleName: {
              strategy: titleNameBuildStrategyName,
            },
          },
        },
        consoles: {
          list: consoleNames,
          data: deviceConsolesEnvData,
        },
        "content-targets": {
          names: contentTargetNames,
          paths: contentTargetPaths,
        },
        fileIO: {
          strategy: {
            name: fileIOStrategyName,
            data: {
              fs: {
                crud: {
                  strategy: fileIOFsCrudStrategyName,
                },
              },
              sftp: {
                credentials: {
                  host: fileIOSftpHostCredential,
                  port: fileIOSftpPortCredential,
                  username: fileIOSftpUsernameCredential,
                  password: fileIOSftpPasswordCredential,
                },
              },
            },
          },
        },
      },
      specific: undefined,
    };
  }

  /**
   * computed environment variables
   **/

  /**
   * filtered device names, depending on mode
   **/
  const deviceNames: string[] = deviceNamesFromModes(mode, {
    list: listDeviceNames,
    diff: diffDeviceNames,
    sync: syncDeviceNames,
  });

  return {
    options: {
      log: {
        level: logLevel,
      },
      mode,
      simulate: {
        sync: simulateSync,
      },
    },
    database: {
      paths: databasePaths,
    },
    device: {
      names: deviceNames,
      data: devicesData,
    },
  };
};

export default buildEnvironment;
