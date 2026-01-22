import AppNotFoundError from "../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import ALL_LOG_LEVELS from "../../constants/all-log-levels.constant.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import DEVICE_NAMES from "../../constants/device-names.constant.js";
import MODE_NAMES from "../../constants/mode-names.constant.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import typeGuards from "../typescript/guards/index.js";
import validation from "../validation/index.js";
import isStringIpv4Address from "../validation/is-string-ipv4-address.helper.js";
import consoleNamesFromConsolesList from "./console-names-from-consoles-list.helper.js";
import deviceNamesFromDevicesList from "./device-names-from-devices-list.helper.js";
import intersectStringArraySimple from "./intersect-string-array-simple.helper.js";
import CONTENT_TARGET_NAMES from "../../constants/content-target-names.constant.js";
import contentTargetNamesFromContentTargetsList from "./content-target-names-from-content-targets-list.helper.js";
import FILE_IO_STRATEGIES from "../../constants/file-io-strategies.constant.js";
import FILE_IO_FS_CRUD_STRATEGIES from "../../constants/file-io-fs-crud-strategies.constant.js";
import type { DeviceName } from "../../types/device-name.type.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import setConsolesDataMediaNamesFromStringPairs from "../mutate/set-consoles-data-media-names-from-string-pairs.helper.js";
import type { ConsolesData } from "../../types/consoles-data.type.js";

const environmentFromProcessVariables = (): Environment => {
  /*
   * LOG_LEVEL
   */
  const logLevel = (process.env.LOG_LEVEL || "info").toUpperCase();
  if (!typeGuards.isLogLevel(logLevel))
    throw new AppValidationError(
      `${logLevel} is not a valid log level. Please choose one from the following and assign it to the LOG_LEVEL environment variable: ${ALL_LOG_LEVELS.join(", ")}.`,
    );

  /*
   * DATABASE_ROMS_DIR_PATH
   */
  const databaseRomsDirPath = process.env.DATABASE_ROMS_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(databaseRomsDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the DATABASE_ROMS_DIR_PATH environment variable.",
    );

  /*
   * DATABASE_MEDIA_DIR_PATH
   */
  const databaseMediaDirPath = process.env.DATABASE_MEDIA_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(databaseMediaDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the DATABASE_MEDIA_DIR_PATH environment variable.",
    );

  /*
   * DATABASE_ES_DE_GAMELISTS_DIR_PATH
   */
  const databaseEsDeGamelistsDirPath =
    process.env.DATABASE_ES_DE_GAMELISTS_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(databaseEsDeGamelistsDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the DATABASE_ES_DE_GAMELISTS_DIR_PATH environment variable.",
    );

  /*
   * MODE
   */
  const mode = process.env.MODE || "diff";
  if (!typeGuards.isModeName(mode))
    throw new AppValidationError(
      `${mode} is an invalid mode. Please feed MODE one from the following modes: ${MODE_NAMES.join(", ")}.`,
    );

  /*
   * LIST_DEVICES_LIST
   */
  const rawListDevicesList = process.env.LIST_DEVICES_LIST || "none";
  const listDevicesList = [
    ...new Set(rawListDevicesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isDevicesList(listDevicesList))
    throw new AppValidationError(
      `${listDevicesList} is an invalid list of devices. Please provide LIST_DEVICES_LIST a comma-separated list of valid devices: ${DEVICE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all devices respectively.`,
    );
  const listDeviceNames = deviceNamesFromDevicesList(listDevicesList);

  /*
   * DIFF_DEVICES_LIST
   */
  const rawDiffDevicesList = process.env.DIFF_DEVICES_LIST || "none";
  const diffDevicesList = [
    ...new Set(rawDiffDevicesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isDevicesList(diffDevicesList))
    throw new AppValidationError(
      `${diffDevicesList} is an invalid list of devices. Please provide DIFF_DEVICES_LIST a comma-separated list of valid devices: ${DEVICE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all devices respectively.`,
    );
  const diffDeviceNames = deviceNamesFromDevicesList(diffDevicesList);

  /*
   * SYNC_DEVICES_LIST
   */
  const rawSyncDevicesList = process.env.SYNC_DEVICES_LIST || "none";
  const syncDevicesList = [
    ...new Set(rawSyncDevicesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isDevicesList(syncDevicesList))
    throw new AppValidationError(
      `${syncDevicesList} is an invalid list of devices. Please provide SYNC_DEVICES_LIST a comma-separated list of valid devices: ${DEVICE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all devices respectively.`,
    );
  const syncDeviceNames = deviceNamesFromDevicesList(syncDevicesList);

  /*
   * SIMULATE_SYNC
   */
  const rawSimulateSync = process.env.SIMULATE_SYNC || "1";
  if (!validation.isStringZeroOrOne(rawSimulateSync))
    throw new AppValidationError(`SIMULATE_SYNC must be either a 0 or a 1.`);
  const simulateSync = +rawSimulateSync === 1 ? true : false;

  /*****
   * Device: alejandro-g75jt
   *****/

  /*
   * ALEJANDRO_G751JT_CONTENT_TARGETS_LIST
   */
  const rawAlejandroG751JTContentTargetsList =
    process.env.ALEJANDRO_G751JT_CONTENT_TARGETS_LIST || "none";
  const alejandroG751JTContentTargetsList = [
    ...new Set(
      rawAlejandroG751JTContentTargetsList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isContentTargetsList(alejandroG751JTContentTargetsList))
    throw new AppValidationError(
      `${alejandroG751JTContentTargetsList} is an invalid list of content targets. Please provide ALEJANDRO_G751JT_CONTENT_TARGETS_LIST a comma-separated list of valid content targets: ${CONTENT_TARGET_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all content targets respectively.`,
    );
  const alejandroG751JTContentTargetNames =
    contentTargetNamesFromContentTargetsList(alejandroG751JTContentTargetsList);

  /*
   * ALEJANDRO_G751JT_CONTENT_TARGET_ROMS_DIR_PATH
   */
  const alejandroG751JTContentTargetRomsDirPath =
    process.env.ALEJANDRO_G751JT_CONTENT_TARGET_ROMS_DIR_PATH || "";
  if (
    !validation.isStringAbsoluteUnixPath(
      alejandroG751JTContentTargetRomsDirPath,
    )
  )
    throw new AppValidationError(
      "ALEJANDRO_G751JT_CONTENT_TARGET_ROMS_DIR_PATH must be a valid Unix path.",
    );

  /*
   * ALEJANDRO_G751JT_CONTENT_TARGET_MEDIA_DIR_PATH
   */
  const alejandroG751JTContentTargetMediaDirPath =
    process.env.ALEJANDRO_G751JT_CONTENT_TARGET_MEDIA_DIR_PATH || "";
  if (
    !validation.isStringAbsoluteUnixPath(
      alejandroG751JTContentTargetMediaDirPath,
    )
  )
    throw new AppValidationError(
      "ALEJANDRO_G751JT_CONTENT_TARGET_MEDIA_DIR_PATH must be a valid Unix path.",
    );

  /*
   * ALEJANDRO_G751JT_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH
   */
  const alejandroG751JTContentTargetEsDeGamelistsDirPath =
    process.env.ALEJANDRO_G751JT_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH || "";
  if (
    !validation.isStringAbsoluteUnixPath(
      alejandroG751JTContentTargetEsDeGamelistsDirPath,
    )
  )
    throw new AppValidationError(
      "ALEJANDRO_G751JT_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH must be a valid Unix path.",
    );

  /*
   * ALEJANDRO_G751JT_FILE_IO_STRATEGY
   */
  const alejandroG751JTFileIOStrategy =
    process.env.ALEJANDRO_G751JT_FILE_IO_STRATEGY || "fs";
  if (!typeGuards.isFileIOStrategy(alejandroG751JTFileIOStrategy))
    throw new AppValidationError(
      `${alejandroG751JTFileIOStrategy} is not a valid File IO strategy. Please inject ALEJANDRO_G751JT_FILE_IO_STRATEGY with one of the following File IO strategies: ${FILE_IO_STRATEGIES.join(", ")}.`,
    );

  /*
   * ALEJANDRO_G751JT_FILE_IO_FS_CRUD_STRATEGY
   */
  const alejandroG751JTFileIoFsCrudStrategy =
    process.env.ALEJANDRO_G751JT_FILE_IO_FS_CRUD_STRATEGY || "symlink";
  if (!typeGuards.isFileIOFsCrudStrategy(alejandroG751JTFileIoFsCrudStrategy))
    throw new AppValidationError(
      `${alejandroG751JTFileIoFsCrudStrategy} is not a valid FileIO.Fs strategy. Please inject ALEJANDRO_G751JT_FILE_IO_FS_CRUD_STRATEGY with one of the following FileIO.Fs strategies: ${FILE_IO_FS_CRUD_STRATEGIES.join(", ")}.`,
    );

  /*
   * ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_HOST
   */
  const alejandroG751JTFileIOSftpCredentialsHost =
    process.env.ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_HOST || "";
  if (!isStringIpv4Address(alejandroG751JTFileIOSftpCredentialsHost))
    throw new AppValidationError(
      "ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_HOST must be a valid IPv4 address.",
    );

  /*
   * ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_PORT
   */
  const rawAlejandroG751JTFileIOSftpCredentialsPort =
    process.env.ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_PORT || "22";
  if (!validation.isStringPort(rawAlejandroG751JTFileIOSftpCredentialsPort))
    throw new AppValidationError(
      "ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_PORT must be a valid port [0-65535].",
    );
  const alejandroG751JTFileIOSftpCredentialsPort =
    +rawAlejandroG751JTFileIOSftpCredentialsPort;

  /*
   * ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_USERNAME
   */
  const alejandroG751JTFileIOSftpCredentialsUsername =
    process.env.ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_USERNAME || "";

  /*
   * ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_PASSWORD
   */
  const alejandroG751JTFileIOSftpCredentialsPassword =
    process.env.ALEJANDRO_G751JT_FILE_IO_SFTP_CREDENTIALS_PASSWORD || "";

  /*
   * ALEJANDRO_G751JT_LIST_CONSOLES_LIST
   */
  const rawAlejandroG751JTListConsolesList =
    process.env.ALEJANDRO_G751JT_LIST_CONSOLES_LIST || "none";
  const alejandroG751JTListConsolesList = [
    ...new Set(
      rawAlejandroG751JTListConsolesList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isConsolesList(alejandroG751JTListConsolesList))
    throw new AppValidationError(
      `${alejandroG751JTListConsolesList} is an invalid list of consoles. Please provide ALEJANDRO_G751JT_LIST_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const alejandroG751JTListConsoleNames = consoleNamesFromConsolesList(
    alejandroG751JTListConsolesList,
  );

  const alejandroG751JTListConsolesData: ConsolesData = {};
  for (const consoleName of alejandroG751JTListConsoleNames)
    alejandroG751JTListConsolesData[consoleName] = {
      name: consoleName,
      "content-targets": { media: { names: [] } },
    };

  /*
   * ALEJANDRO_G751JT_DIFF_CONSOLES_LIST
   */
  const rawAlejandroG751JTDiffConsolesList =
    process.env.ALEJANDRO_G751JT_DIFF_CONSOLES_LIST || "none";
  const alejandroG751JTDiffConsolesList = [
    ...new Set(
      rawAlejandroG751JTDiffConsolesList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isConsolesList(alejandroG751JTDiffConsolesList))
    throw new AppValidationError(
      `${alejandroG751JTDiffConsolesList} is an invalid list of consoles. Please provide ALEJANDRO_G751JT_DIFF_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const alejandroG751JTDiffConsoleNames = consoleNamesFromConsolesList(
    alejandroG751JTDiffConsolesList,
  );

  const alejandroG751JTDiffConsolesData: ConsolesData = {};
  for (const consoleName of alejandroG751JTDiffConsoleNames)
    alejandroG751JTDiffConsolesData[consoleName] = {
      name: consoleName,
      "content-targets": { media: { names: [] } },
    };

  /*
   * ALEJANDRO_G751JT_SYNC_CONSOLES_LIST
   */
  const rawAlejandroG751JTSyncConsolesList =
    process.env.ALEJANDRO_G751JT_SYNC_CONSOLES_LIST || "none";
  const alejandroG751JTSyncConsolesList = [
    ...new Set(
      rawAlejandroG751JTSyncConsolesList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isConsolesList(alejandroG751JTSyncConsolesList))
    throw new AppValidationError(
      `${alejandroG751JTSyncConsolesList} is an invalid list of consoles. Please provide ALEJANDRO_G751JT_SYNC_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const alejandroG751JTSyncConsoleNames = consoleNamesFromConsolesList(
    alejandroG751JTSyncConsolesList,
  );

  const alejandroG751JTSyncConsolesData: ConsolesData = {};
  for (const consoleName of alejandroG751JTSyncConsoleNames)
    alejandroG751JTSyncConsolesData[consoleName] = {
      name: consoleName,
      "content-targets": { media: { names: [] } },
    };

  /*
   * ALEJANDRO_G751JT_LIST_CONSOLES_MEDIAS_LISTS
   */
  const rawAlejandroG751JTListConsolesMediasLists =
    process.env.ALEJANDRO_G751JT_LIST_CONSOLES_MEDIAS_LISTS || "none";
  const alejandroG751JTListConsoleMediaPairs =
    rawAlejandroG751JTListConsolesMediasLists.split(",").map((s) => s.trim());
  const alejandroG751JTListConsoleMediaPairsValidationError =
    setConsolesDataMediaNamesFromStringPairs(
      alejandroG751JTListConsolesData,
      alejandroG751JTListConsoleMediaPairs,
    );
  if (alejandroG751JTListConsoleMediaPairsValidationError)
    throw alejandroG751JTListConsoleMediaPairsValidationError;

  /*
   * ALEJANDRO_G751JT_DIFF_CONSOLES_MEDIAS_LISTS
   */
  const rawAlejandroG751JTDiffConsolesMediasLists =
    process.env.ALEJANDRO_G751JT_DIFF_CONSOLES_MEDIAS_LISTS || "none";
  const alejandroG751JTDiffConsoleMediaPairs =
    rawAlejandroG751JTDiffConsolesMediasLists.split(",").map((s) => s.trim());
  const alejandroG751JTDiffConsoleMediaPairsValidationError =
    setConsolesDataMediaNamesFromStringPairs(
      alejandroG751JTDiffConsolesData,
      alejandroG751JTDiffConsoleMediaPairs,
    );
  if (alejandroG751JTDiffConsoleMediaPairsValidationError)
    throw alejandroG751JTDiffConsoleMediaPairsValidationError;

  /*
   * ALEJANDRO_G751JT_SYNC_CONSOLES_MEDIAS_LISTS
   */
  const rawAlejandroG751JTSyncConsolesMediasLists =
    process.env.ALEJANDRO_G751JT_SYNC_CONSOLES_MEDIAS_LISTS || "none";
  const alejandroG751JTSyncConsoleMediaPairs =
    rawAlejandroG751JTSyncConsolesMediasLists.split(",").map((s) => s.trim());
  const alejandroG751JTSyncConsoleMediaPairsValidationError =
    setConsolesDataMediaNamesFromStringPairs(
      alejandroG751JTSyncConsolesData,
      alejandroG751JTSyncConsoleMediaPairs,
    );
  if (alejandroG751JTSyncConsoleMediaPairsValidationError)
    throw alejandroG751JTSyncConsoleMediaPairsValidationError;

  /*****
   * Device: steam-deck-lcd-alejandro
   *****/

  /*
   * STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGETS_LIST
   */
  const rawSteamDeckLCDAlejandroContentTargetsList =
    process.env.STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGETS_LIST || "none";
  const steamDeckLCDAlejandroContentTargetsList = [
    ...new Set(
      rawSteamDeckLCDAlejandroContentTargetsList
        .split(",")
        .map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isContentTargetsList(steamDeckLCDAlejandroContentTargetsList))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroContentTargetsList} is an invalid list of content targets. Please provide STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGETS_LIST a comma-separated list of valid content targets: ${CONTENT_TARGET_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all content targets respectively.`,
    );
  const steamDeckLCDAlejandroContentTargetNames =
    contentTargetNamesFromContentTargetsList(
      steamDeckLCDAlejandroContentTargetsList,
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ROMS_DIR_PATH
   */
  const steamDeckLCDAlejandroContentTargetRomsDirPath =
    process.env.STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ROMS_DIR_PATH || "";
  if (
    !validation.isStringAbsoluteUnixPath(
      steamDeckLCDAlejandroContentTargetRomsDirPath,
    )
  )
    throw new AppValidationError(
      "STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ROMS_DIR_PATH must be a valid Unix path.",
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_MEDIA_DIR_PATH
   */
  const steamDeckLCDAlejandroContentTargetMediaDirPath =
    process.env.STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_MEDIA_DIR_PATH || "";
  if (
    !validation.isStringAbsoluteUnixPath(
      steamDeckLCDAlejandroContentTargetMediaDirPath,
    )
  )
    throw new AppValidationError(
      "STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_MEDIA_DIR_PATH must be a valid Unix path.",
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH
   */
  const steamDeckLCDAlejandroContentTargetEsDeGamelistsDirPath =
    process.env
      .STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH || "";
  if (
    !validation.isStringAbsoluteUnixPath(
      steamDeckLCDAlejandroContentTargetEsDeGamelistsDirPath,
    )
  )
    throw new AppValidationError(
      "STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH must be a valid Unix path.",
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_FILE_IO_STRATEGY
   */
  const steamDeckLCDAlejandroFileIOStrategy =
    process.env.STEAM_DECK_LCD_ALEJANDRO_FILE_IO_STRATEGY || "sftp";
  if (!typeGuards.isFileIOStrategy(steamDeckLCDAlejandroFileIOStrategy))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroFileIOStrategy} is not a valid File IO strategy. Please inject STEAM_DECK_LCD_ALEJANDRO_FILE_IO_STRATEGY with one of the following File IO strategies: ${FILE_IO_STRATEGIES.join(", ")}.`,
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_FILE_IO_FS_CRUD_STRATEGY
   */
  const steamDeckLCDAlejandroFileIoFsCrudStrategy =
    process.env.STEAM_DECK_LCD_ALEJANDRO_FILE_IO_FS_CRUD_STRATEGY || "copy";
  if (
    !typeGuards.isFileIOFsCrudStrategy(
      steamDeckLCDAlejandroFileIoFsCrudStrategy,
    )
  )
    throw new AppValidationError(
      `${steamDeckLCDAlejandroFileIoFsCrudStrategy} is not a valid FileIO.Fs strategy. Please inject STEAM_DECK_LCD_ALEJANDRO_FILE_IO_FS_CRUD_STRATEGY with one of the following FileIO.Fs strategies: ${FILE_IO_FS_CRUD_STRATEGIES.join(", ")}.`,
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_HOST
   */
  const steamDeckLCDAlejandroFileIOSftpCredentialsHost =
    process.env.STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_HOST || "";
  if (!isStringIpv4Address(steamDeckLCDAlejandroFileIOSftpCredentialsHost))
    throw new AppValidationError(
      "STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_HOST must be a valid IPv4 address.",
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_PORT
   */
  const rawSteamDeckLCDAlejandroFileIOSftpCredentialsPort =
    process.env.STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_PORT || "22";
  if (
    !validation.isStringPort(rawSteamDeckLCDAlejandroFileIOSftpCredentialsPort)
  )
    throw new AppValidationError(
      "STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_PORT must be a valid port [0-65535].",
    );
  const steamDeckLCDAlejandroFileIOSftpCredentialsPort =
    +rawSteamDeckLCDAlejandroFileIOSftpCredentialsPort;

  /*
   * STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_USERNAME
   */
  const steamDeckLCDAlejandroFileIOSftpCredentialsUsername =
    process.env.STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_USERNAME ||
    "";

  /*
   * STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_PASSWORD
   */
  const steamDeckLCDAlejandroFileIOSftpCredentialsPassword =
    process.env.STEAM_DECK_LCD_ALEJANDRO_FILE_IO_SFTP_CREDENTIALS_PASSWORD ||
    "";

  /*
   * STEAM_DECK_LCD_ALEJANDRO_LIST_CONSOLES_LIST
   */
  const rawSteamDeckLCDAlejandroListConsolesList =
    process.env.STEAM_DECK_LCD_ALEJANDRO_LIST_CONSOLES_LIST || "none";
  const steamDeckLCDAlejandroListConsolesList = [
    ...new Set(
      rawSteamDeckLCDAlejandroListConsolesList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isConsolesList(steamDeckLCDAlejandroListConsolesList))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroListConsolesList} is an invalid list of consoles. Please provide STEAM_DECK_LCD_ALEJANDRO_LIST_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const steamDeckLCDAlejandroListConsoleNames = consoleNamesFromConsolesList(
    steamDeckLCDAlejandroListConsolesList,
  );

  const steamDeckLCDAlejandroListConsolesData: ConsolesData = {};
  for (const consoleName of steamDeckLCDAlejandroListConsoleNames)
    steamDeckLCDAlejandroListConsolesData[consoleName] = {
      name: consoleName,
      "content-targets": { media: { names: [] } },
    };

  /*
   * STEAM_DECK_LCD_ALEJANDRO_DIFF_CONSOLES_LIST
   */
  const rawSteamDeckLCDAlejandroDiffConsolesList =
    process.env.STEAM_DECK_LCD_ALEJANDRO_DIFF_CONSOLES_LIST || "none";
  const steamDeckLCDAlejandroDiffConsolesList = [
    ...new Set(
      rawSteamDeckLCDAlejandroDiffConsolesList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isConsolesList(steamDeckLCDAlejandroDiffConsolesList))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroDiffConsolesList} is an invalid list of consoles. Please provide STEAM_DECK_LCD_ALEJANDRO_DIFF_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const steamDeckLCDAlejandroDiffConsoleNames = consoleNamesFromConsolesList(
    steamDeckLCDAlejandroDiffConsolesList,
  );

  const steamDeckLCDAlejandroDiffConsolesData: ConsolesData = {};
  for (const consoleName of steamDeckLCDAlejandroDiffConsoleNames)
    steamDeckLCDAlejandroDiffConsolesData[consoleName] = {
      name: consoleName,
      "content-targets": { media: { names: [] } },
    };

  /*
   * STEAM_DECK_LCD_ALEJANDRO_SYNC_CONSOLES_LIST
   */
  const rawSteamDeckLCDAlejandroSyncConsolesList =
    process.env.STEAM_DECK_LCD_ALEJANDRO_SYNC_CONSOLES_LIST || "none";
  const steamDeckLCDAlejandroSyncConsolesList = [
    ...new Set(
      rawSteamDeckLCDAlejandroSyncConsolesList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isConsolesList(steamDeckLCDAlejandroSyncConsolesList))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroSyncConsolesList} is an invalid list of consoles. Please provide STEAM_DECK_LCD_ALEJANDRO_SYNC_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const steamDeckLCDAlejandroSyncConsoleNames = consoleNamesFromConsolesList(
    steamDeckLCDAlejandroSyncConsolesList,
  );

  const steamDeckLCDAlejandroSyncConsolesData: ConsolesData = {};
  for (const consoleName of steamDeckLCDAlejandroSyncConsoleNames)
    steamDeckLCDAlejandroSyncConsolesData[consoleName] = {
      name: consoleName,
      "content-targets": { media: { names: [] } },
    };

  /*
   * STEAM_DECK_LCD_ALEJANDRO_LIST_CONSOLES_MEDIAS_LISTS
   */
  const rawSteamDeckLCDAlejandroListConsolesMediasLists =
    process.env.STEAM_DECK_LCD_ALEJANDRO_LIST_CONSOLES_MEDIAS_LISTS || "none";
  const steamDeckLCDAlejandroListConsoleMediaPairs =
    rawSteamDeckLCDAlejandroListConsolesMediasLists
      .split(",")
      .map((s) => s.trim());
  const steamDeckLCDAlejandroListConsoleMediaPairsValidationError =
    setConsolesDataMediaNamesFromStringPairs(
      steamDeckLCDAlejandroListConsolesData,
      steamDeckLCDAlejandroListConsoleMediaPairs,
    );
  if (steamDeckLCDAlejandroListConsoleMediaPairsValidationError)
    throw steamDeckLCDAlejandroListConsoleMediaPairsValidationError;

  /*
   * STEAM_DECK_LCD_ALEJANDRO_DIFF_CONSOLES_MEDIAS_LISTS
   */
  const rawSteamDeckLCDAlejandroDiffConsolesMediasLists =
    process.env.STEAM_DECK_LCD_ALEJANDRO_DIFF_CONSOLES_MEDIAS_LISTS || "none";
  const steamDeckLCDAlejandroDiffConsoleMediaPairs =
    rawSteamDeckLCDAlejandroDiffConsolesMediasLists
      .split(",")
      .map((s) => s.trim());
  const steamDeckLCDAlejandroDiffConsoleMediaPairsValidationError =
    setConsolesDataMediaNamesFromStringPairs(
      steamDeckLCDAlejandroDiffConsolesData,
      steamDeckLCDAlejandroDiffConsoleMediaPairs,
    );
  if (steamDeckLCDAlejandroDiffConsoleMediaPairsValidationError)
    throw steamDeckLCDAlejandroDiffConsoleMediaPairsValidationError;

  /*
   * STEAM_DECK_LCD_ALEJANDRO_SYNC_CONSOLES_MEDIAS_LISTS
   */
  const rawSteamDeckLCDAlejandroSyncConsolesMediasLists =
    process.env.STEAM_DECK_LCD_ALEJANDRO_SYNC_CONSOLES_MEDIAS_LISTS || "none";
  const steamDeckLCDAlejandroSyncConsoleMediaPairs =
    rawSteamDeckLCDAlejandroSyncConsolesMediasLists
      .split(",")
      .map((s) => s.trim());
  const steamDeckLCDAlejandroSyncConsoleMediaPairsValidationError =
    setConsolesDataMediaNamesFromStringPairs(
      steamDeckLCDAlejandroSyncConsolesData,
      steamDeckLCDAlejandroSyncConsoleMediaPairs,
    );
  if (steamDeckLCDAlejandroSyncConsoleMediaPairsValidationError)
    throw steamDeckLCDAlejandroSyncConsoleMediaPairsValidationError;

  /*
   * Computed Environment Variables
   */

  /*
   * Filtered device names depending on mode
   */
  let deviceNames: DeviceName[];

  switch (mode) {
    case "diff": {
      deviceNames = diffDeviceNames;
      break;
    }
    case "list": {
      deviceNames = listDeviceNames;
      break;
    }
    case "sync": {
      deviceNames = syncDeviceNames;
      break;
    }
    case "diff-sync": {
      deviceNames = intersectStringArraySimple(
        diffDeviceNames,
        syncDeviceNames,
      );
      break;
    }
    case "sync-list": {
      deviceNames = intersectStringArraySimple(
        syncDeviceNames,
        listDeviceNames,
      );
      break;
    }
    case "diff-sync-list":
    case "list-diff-sync-list": {
      deviceNames = intersectStringArraySimple(
        diffDeviceNames,
        intersectStringArraySimple(syncDeviceNames, listDeviceNames),
      );
      break;
    }
  }

  /*
   * Filtered device's console names, depending on mode
   */
  let alejandroG751JTConsoleNames: ConsoleName[];
  let steamDeckLCDAlejandroConsoleNames: ConsoleName[];

  switch (mode) {
    case "diff": {
      alejandroG751JTConsoleNames = alejandroG751JTDiffConsoleNames;
      steamDeckLCDAlejandroConsoleNames = steamDeckLCDAlejandroDiffConsoleNames;
      break;
    }
    case "list": {
      alejandroG751JTConsoleNames = alejandroG751JTListConsoleNames;
      steamDeckLCDAlejandroConsoleNames = steamDeckLCDAlejandroListConsoleNames;
      break;
    }
    case "sync": {
      alejandroG751JTConsoleNames = alejandroG751JTSyncConsoleNames;
      steamDeckLCDAlejandroConsoleNames = steamDeckLCDAlejandroSyncConsoleNames;
      break;
    }
    case "diff-sync": {
      alejandroG751JTConsoleNames = intersectStringArraySimple(
        alejandroG751JTDiffConsoleNames,
        alejandroG751JTSyncConsoleNames,
      );
      steamDeckLCDAlejandroConsoleNames = intersectStringArraySimple(
        steamDeckLCDAlejandroDiffConsoleNames,
        steamDeckLCDAlejandroSyncConsoleNames,
      );
      break;
    }
    case "sync-list": {
      alejandroG751JTConsoleNames = intersectStringArraySimple(
        alejandroG751JTSyncConsoleNames,
        alejandroG751JTListConsoleNames,
      );
      steamDeckLCDAlejandroConsoleNames = intersectStringArraySimple(
        steamDeckLCDAlejandroSyncConsoleNames,
        steamDeckLCDAlejandroListConsoleNames,
      );
      break;
    }
    case "diff-sync-list":
    case "list-diff-sync-list": {
      alejandroG751JTConsoleNames = intersectStringArraySimple(
        alejandroG751JTDiffConsoleNames,
        intersectStringArraySimple(
          alejandroG751JTSyncConsoleNames,
          alejandroG751JTListConsoleNames,
        ),
      );
      steamDeckLCDAlejandroConsoleNames = intersectStringArraySimple(
        steamDeckLCDAlejandroDiffConsoleNames,
        intersectStringArraySimple(
          steamDeckLCDAlejandroSyncConsoleNames,
          steamDeckLCDAlejandroListConsoleNames,
        ),
      );
      break;
    }
  }

  /*
   * Intersected consoles data, depending on mode
   */
  const alejandroG751JTConsolesData: ConsolesData = {};
  for (const consoleName of alejandroG751JTConsoleNames) {
    switch (mode) {
      case "diff": {
        if (!alejandroG751JTDiffConsolesData[consoleName]) continue;
        alejandroG751JTConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names:
                alejandroG751JTDiffConsolesData[consoleName]["content-targets"]
                  .media.names,
            },
          },
        };
        break;
      }
      case "list": {
        if (!alejandroG751JTListConsolesData[consoleName]) continue;
        alejandroG751JTConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names:
                alejandroG751JTListConsolesData[consoleName]["content-targets"]
                  .media.names,
            },
          },
        };
        break;
      }
      case "sync": {
        if (!alejandroG751JTSyncConsolesData[consoleName]) continue;
        alejandroG751JTConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names:
                alejandroG751JTSyncConsolesData[consoleName]["content-targets"]
                  .media.names,
            },
          },
        };
        break;
      }
      case "diff-sync": {
        if (
          !alejandroG751JTDiffConsolesData[consoleName] ||
          !alejandroG751JTSyncConsolesData[consoleName]
        )
          continue;
        alejandroG751JTConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                alejandroG751JTDiffConsolesData[consoleName]["content-targets"]
                  .media.names,
                alejandroG751JTSyncConsolesData[consoleName]["content-targets"]
                  .media.names,
              ),
            },
          },
        };
        break;
      }
      case "sync-list": {
        if (
          !alejandroG751JTSyncConsolesData[consoleName] ||
          !alejandroG751JTListConsolesData[consoleName]
        )
          continue;
        alejandroG751JTConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                alejandroG751JTSyncConsolesData[consoleName]["content-targets"]
                  .media.names,
                alejandroG751JTListConsolesData[consoleName]["content-targets"]
                  .media.names,
              ),
            },
          },
        };
        break;
      }
      case "diff-sync-list":
      case "list-diff-sync-list": {
        if (
          !alejandroG751JTListConsolesData[consoleName] ||
          !alejandroG751JTDiffConsolesData[consoleName] ||
          !alejandroG751JTSyncConsolesData[consoleName]
        )
          continue;
        alejandroG751JTConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                alejandroG751JTListConsolesData[consoleName]["content-targets"]
                  .media.names,
                intersectStringArraySimple(
                  alejandroG751JTDiffConsolesData[consoleName][
                    "content-targets"
                  ].media.names,
                  alejandroG751JTSyncConsolesData[consoleName][
                    "content-targets"
                  ].media.names,
                ),
              ),
            },
          },
        };
        break;
      }
    }
  }

  const steamDeckLCDAlejandroConsolesData: ConsolesData = {};
  for (const consoleName of steamDeckLCDAlejandroConsoleNames) {
    switch (mode) {
      case "diff": {
        if (!steamDeckLCDAlejandroDiffConsolesData[consoleName]) continue;
        steamDeckLCDAlejandroConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names:
                steamDeckLCDAlejandroDiffConsolesData[consoleName][
                  "content-targets"
                ].media.names,
            },
          },
        };
        break;
      }
      case "list": {
        if (!steamDeckLCDAlejandroListConsolesData[consoleName]) continue;
        steamDeckLCDAlejandroConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names:
                steamDeckLCDAlejandroListConsolesData[consoleName][
                  "content-targets"
                ].media.names,
            },
          },
        };
        break;
      }
      case "sync": {
        if (!steamDeckLCDAlejandroSyncConsolesData[consoleName]) continue;
        steamDeckLCDAlejandroConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names:
                steamDeckLCDAlejandroSyncConsolesData[consoleName][
                  "content-targets"
                ].media.names,
            },
          },
        };
        break;
      }
      case "diff-sync": {
        if (
          !steamDeckLCDAlejandroDiffConsolesData[consoleName] ||
          !steamDeckLCDAlejandroSyncConsolesData[consoleName]
        )
          continue;
        steamDeckLCDAlejandroConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                steamDeckLCDAlejandroDiffConsolesData[consoleName][
                  "content-targets"
                ].media.names,
                steamDeckLCDAlejandroSyncConsolesData[consoleName][
                  "content-targets"
                ].media.names,
              ),
            },
          },
        };
        break;
      }
      case "sync-list": {
        if (
          !steamDeckLCDAlejandroSyncConsolesData[consoleName] ||
          !steamDeckLCDAlejandroListConsolesData[consoleName]
        )
          continue;
        steamDeckLCDAlejandroConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                steamDeckLCDAlejandroSyncConsolesData[consoleName][
                  "content-targets"
                ].media.names,
                steamDeckLCDAlejandroListConsolesData[consoleName][
                  "content-targets"
                ].media.names,
              ),
            },
          },
        };
        break;
      }
      case "diff-sync-list":
      case "list-diff-sync-list": {
        if (
          !steamDeckLCDAlejandroListConsolesData[consoleName] ||
          !steamDeckLCDAlejandroDiffConsolesData[consoleName] ||
          !steamDeckLCDAlejandroSyncConsolesData[consoleName]
        )
          continue;
        steamDeckLCDAlejandroConsolesData[consoleName] = {
          name: consoleName,
          "content-targets": {
            media: {
              names: intersectStringArraySimple(
                steamDeckLCDAlejandroListConsolesData[consoleName][
                  "content-targets"
                ].media.names,
                intersectStringArraySimple(
                  steamDeckLCDAlejandroDiffConsolesData[consoleName][
                    "content-targets"
                  ].media.names,
                  steamDeckLCDAlejandroSyncConsolesData[consoleName][
                    "content-targets"
                  ].media.names,
                ),
              ),
            },
          },
        };
        break;
      }
    }
  }

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
      paths: {
        roms: databaseRomsDirPath,
        media: databaseMediaDirPath,
        "es-de-gamelists": databaseEsDeGamelistsDirPath,
      },
    },
    device: {
      names: deviceNames,
      data: {
        "alejandro-g751jt": {
          consoles: alejandroG751JTConsolesData,
          "content-targets": {
            names: alejandroG751JTContentTargetNames,
            paths: {
              roms: alejandroG751JTContentTargetRomsDirPath,
              media: alejandroG751JTContentTargetMediaDirPath,
              "es-de-gamelists":
                alejandroG751JTContentTargetEsDeGamelistsDirPath,
            },
          },
          fileIO: {
            strategy: alejandroG751JTFileIOStrategy,
            data: {
              fs: {
                crud: {
                  strategy: alejandroG751JTFileIoFsCrudStrategy,
                },
              },
              sftp: {
                credentials: {
                  host: alejandroG751JTFileIOSftpCredentialsHost,
                  port: alejandroG751JTFileIOSftpCredentialsPort,
                  username: alejandroG751JTFileIOSftpCredentialsUsername,
                  password: alejandroG751JTFileIOSftpCredentialsPassword,
                },
              },
            },
          },
        },
        "steam-deck-lcd-alejandro": {
          consoles: steamDeckLCDAlejandroConsolesData,
          "content-targets": {
            names: steamDeckLCDAlejandroContentTargetNames,
            paths: {
              roms: steamDeckLCDAlejandroContentTargetRomsDirPath,
              media: steamDeckLCDAlejandroContentTargetMediaDirPath,
              "es-de-gamelists":
                steamDeckLCDAlejandroContentTargetEsDeGamelistsDirPath,
            },
          },
          fileIO: {
            strategy: steamDeckLCDAlejandroFileIOStrategy,
            data: {
              fs: {
                crud: {
                  strategy: steamDeckLCDAlejandroFileIoFsCrudStrategy,
                },
              },
              sftp: {
                credentials: {
                  host: steamDeckLCDAlejandroFileIOSftpCredentialsHost,
                  port: steamDeckLCDAlejandroFileIOSftpCredentialsPort,
                  username: steamDeckLCDAlejandroFileIOSftpCredentialsUsername,
                  password: steamDeckLCDAlejandroFileIOSftpCredentialsPassword,
                },
              },
            },
          },
        },
      },
    },
  };
};

export default environmentFromProcessVariables;
