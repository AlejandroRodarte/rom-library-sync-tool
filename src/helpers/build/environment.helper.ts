import data from "../../../data/environment.json" with { type: "json" };
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import ALL_LOG_LEVELS from "../../constants/all-log-levels.constant.js";
import CONTENT_TARGET_NAMES from "../../constants/content-target-names.constant.js";
import FILE_IO_FS_CRUD_STRATEGIES from "../../constants/file-io-fs-crud-strategies.constant.js";
import FILE_IO_STRATEGIES from "../../constants/file-io-strategies.constant.js";
import MODE_NAMES from "../../constants/mode-names.constant.js";
import NONE from "../../constants/none.constant.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import type { JsonRawEnvironment } from "../../interfaces/json-raw-environment.interface.js";
import type { DeviceConsolesEnvData } from "../../types/device-consoles-env-data.type.js";
import setConsolesEnvDataMediaNamesFromRawObject from "../mutate/set-consoles-env-data-media-names-from-raw-object.helper.js";
import typeGuards from "../typescript/guards/index.js";
import validation from "../validation/index.js";
import buildConsoleNames from "./console-names.helper.js";
import buildContentTargetNames from "./content-target-names.helper.js";
import deviceConsolesEnvDataFromModeDeviceConsolesEnvData from "./device-consoles-env-data-from-mode-device-consoles-env-data.helper.js";
import deviceNamesFromModeDeviceNames from "./device-names-from-mode-device-names.helper.js";
import buildDeviceNames from "./device-names.helper.js";

const mutate = {
  setConsolesEnvDataMediaNamesFromRawObject,
};

const environment = (): Environment => {
  const jsonRawEnvironment: JsonRawEnvironment = data;

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
      `${mode} is an invalid mode. Please choose one from the following: ${MODE_NAMES.join(", ")}.`,
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
      `Database paths can only be related to content target names: ${CONTENT_TARGET_NAMES.join(", ")}.`,
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
   */
  const rawListDeviceNames = jsonRawEnvironment.device.names.list;
  const [listDeviceNames, listDeviceNamesValidationError] = buildDeviceNames(
    dataDeviceNames,
    rawListDeviceNames,
  );
  if (listDeviceNamesValidationError) throw listDeviceNamesValidationError;

  /**
   * device.names.diff
   **/
  const rawDiffDeviceNames = jsonRawEnvironment.device.names.diff;
  const [diffDeviceNames, diffDeviceNamesValidationError] = buildDeviceNames(
    dataDeviceNames,
    rawDiffDeviceNames,
  );
  if (diffDeviceNamesValidationError) throw diffDeviceNamesValidationError;

  /**
   * device.names.sync
   **/
  const rawSyncDeviceNames = jsonRawEnvironment.device.names.sync;
  const [syncDeviceNames, syncDeviceNamesValidationError] = buildDeviceNames(
    dataDeviceNames,
    rawSyncDeviceNames,
  );
  if (syncDeviceNamesValidationError) throw syncDeviceNamesValidationError;

  /**
   * devices data object
   **/
  const devicesData: Environment["device"]["data"] = {};

  /**
   * device.data["<device-name>"]
   **/
  for (const [deviceName, deviceData] of Object.entries(
    jsonRawEnvironment.device.data,
  )) {
    /**
     * device.data["<device-name>"].consoles.names.list
     **/
    const rawListConsoleNames = deviceData.consoles.names.list;
    const [listConsoleNames, listConsoleNamesValidationError] =
      buildConsoleNames(rawListConsoleNames);
    if (listConsoleNamesValidationError) throw listConsoleNamesValidationError;

    /**
     * device.data["<device-name>"].consoles.names.diff
     **/
    const rawDiffConsoleNames = deviceData.consoles.names.diff;
    const [diffConsoleNames, diffConsoleNamesValidationError] =
      buildConsoleNames(rawDiffConsoleNames);
    if (diffConsoleNamesValidationError) throw diffConsoleNamesValidationError;

    /**
     * device.data["<device-name>"].consoles.names.sync
     **/
    const rawSyncConsoleNames = deviceData.consoles.names.sync;
    const [syncConsoleNames, syncConsoleNamesValidationError] =
      buildConsoleNames(rawSyncConsoleNames);
    if (syncConsoleNamesValidationError) throw syncConsoleNamesValidationError;

    /**
     * device's consoles environment data for list mode
     **/
    const listConsolesEnvData: DeviceConsolesEnvData = {};
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
    const diffConsolesEnvData: DeviceConsolesEnvData = {};
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
    const syncConsolesEnvData: DeviceConsolesEnvData = {};
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
    const rawListConsolesMediaNames = deviceData.consoles.media.list;
    if (typeof rawListConsolesMediaNames === "string") {
      if (!typeGuards.isNone(rawListConsolesMediaNames))
        throw new AppValidationError(
          `When console media names is provided as a single string, only the ${NONE} keyword is allowed.`,
        );
    } else {
      const setListConsolesMediaNamesError =
        mutate.setConsolesEnvDataMediaNamesFromRawObject(
          listConsolesEnvData,
          rawListConsolesMediaNames,
        );
      if (setListConsolesMediaNamesError) throw setListConsolesMediaNamesError;
    }

    /**
     * device.data["<device-name>"].consoles.media.diff
     **/
    const rawDiffConsolesMediaNames = deviceData.consoles.media.diff;
    if (typeof rawDiffConsolesMediaNames === "string") {
      if (!typeGuards.isNone(rawDiffConsolesMediaNames))
        throw new AppValidationError(
          `When console media names is provided as a single string, only the ${NONE} keyword is allowed.`,
        );
    } else {
      const setDiffConsolesMediaNamesError =
        mutate.setConsolesEnvDataMediaNamesFromRawObject(
          diffConsolesEnvData,
          rawDiffConsolesMediaNames,
        );
      if (setDiffConsolesMediaNamesError) throw setDiffConsolesMediaNamesError;
    }

    /**
     * device.data["<device-name>"].consoles.media.sync
     **/
    const rawSyncConsolesMediaNames = deviceData.consoles.media.sync;
    if (typeof rawSyncConsolesMediaNames === "string") {
      if (!typeGuards.isNone(rawSyncConsolesMediaNames))
        throw new AppValidationError(
          `When console media names is provided as a single string, only the ${NONE} keyword is allowed.`,
        );
    } else {
      const setSyncConsolesMediaNamesError =
        mutate.setConsolesEnvDataMediaNamesFromRawObject(
          syncConsolesEnvData,
          rawSyncConsolesMediaNames,
        );
      if (setSyncConsolesMediaNamesError) throw setSyncConsolesMediaNamesError;
    }

    /**
     * device.data["<device-name>"]["content-targets"].names
     **/
    const rawContentTargetNames = deviceData["content-targets"].names;
    const [contentTargetNames, contentTargetNamesValidationError] =
      buildContentTargetNames(rawContentTargetNames);
    if (contentTargetNamesValidationError)
      throw contentTargetNamesValidationError;

    /**
     * device.data["<device-name>"]["content-targets"].paths
     **/
    const contentTargetPaths = deviceData["content-targets"].paths;
    if (!typeGuards.isContentTargetPaths(contentTargetPaths))
      throw new AppValidationError(
        `Device paths can only be related to content target names: ${CONTENT_TARGET_NAMES.join(", ")}.`,
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
        `Invalid File IO strategy ${fileIOStrategyName}. Please choose one of the following: ${FILE_IO_STRATEGIES.join(", ")}.`,
      );

    /**
     * device.data["<device-name>"].fileIO.strategy.data.fs.crud.strategy.name
     **/
    const fileIOFsCrudStrategyName =
      deviceData.fileIO.strategy.data.fs.crud.strategy.name;
    if (!typeGuards.isFileIOFsCrudStrategy(fileIOFsCrudStrategyName))
      throw new AppValidationError(
        `Invalid File IO Fs strategy ${fileIOFsCrudStrategyName}. Please choose one of the following: ${FILE_IO_FS_CRUD_STRATEGIES.join(", ")}.`,
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
     * filtered device consoles env data, depending on mode
     **/
    const deviceConsolesEnvData: DeviceConsolesEnvData =
      deviceConsolesEnvDataFromModeDeviceConsolesEnvData(mode, {
        list: listConsolesEnvData,
        diff: diffConsolesEnvData,
        sync: syncConsolesEnvData,
      });

    devicesData[deviceName] = {
      consoles: deviceConsolesEnvData,
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
    };
  }

  /**
   * computed environment variables
   **/

  /**
   * filtered device names, depending on mode
   **/
  const deviceNames: string[] = deviceNamesFromModeDeviceNames(mode, {
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

export default environment;
