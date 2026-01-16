import AppNotFoundError from "../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import ALL_LOG_LEVELS from "../../constants/all-log-levels.constant.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import DEVICE_NAMES from "../../constants/device-names.constant.js";
import MEDIA_NAMES from "../../constants/media-names.constant.js";
import MODE_NAMES from "../../constants/mode-names.constant.js";
import type { Environment } from "../../interfaces/environment.interface.js";
import typeGuards from "../typescript/guards/index.js";
import validation from "../validation/index.js";
import isStringIpv4Address from "../validation/is-string-ipv4-address.helper.js";
import consoleNamesFromConsolesList from "./console-names-from-consoles-list.helper.js";
import deviceNamesFromDevicesList from "./device-names-from-devices-list.helper.js";
import intersectStringArraySimple from "./intersect-string-array-simple.helper.js";
import mediaNamesFromMediasList from "./media-names-from-medias-list.helper.js";
import CONTENT_TARGET_NAMES from "../../constants/content-target-names.constant.js";
import contentTargetNamesFromContentTargetsList from "./content-target-names-from-content-targets-list.helper.js";
import DEVICE_FILE_IO_STRATEGIES from "../../constants/device-file-io-strategies.constant.js";
import DEVICE_FILE_IO_FS_CRUD_STRATEGIES from "../../constants/device-file-io-fs-crud-strategies.constant.js";
import type { DeviceName } from "../../types/device-name.type.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { MediaName } from "../../types/media-name.type.js";

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
  if (!typeGuards.isDeviceFileIOStrategy(alejandroG751JTFileIOStrategy))
    throw new AppValidationError(
      `${alejandroG751JTFileIOStrategy} is not a valid File IO strategy. Please inject ALEJANDRO_G751JT_FILE_IO_STRATEGY with one of the following File IO strategies: ${DEVICE_FILE_IO_STRATEGIES.join(", ")}.`,
    );

  /*
   * ALEJANDRO_G751JT_FILE_IO_FS_CRUD_STRATEGY
   */
  const alejandroG751JTFileIoFsCrudStrategy =
    process.env.ALEJANDRO_G751JT_FILE_IO_FS_CRUD_STRATEGY || "symlink";
  if (
    !typeGuards.isDeviceFileIOFsCrudStrategy(
      alejandroG751JTFileIoFsCrudStrategy,
    )
  )
    throw new AppValidationError(
      `${alejandroG751JTFileIoFsCrudStrategy} is not a valid FileIO.Fs strategy. Please inject ALEJANDRO_G751JT_FILE_IO_FS_CRUD_STRATEGY with one of the following FileIO.Fs strategies: ${DEVICE_FILE_IO_FS_CRUD_STRATEGIES.join(", ")}.`,
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

  /*
   * ALEJANDRO_G751JT_LIST_MEDIAS_LIST
   */
  const rawAlejandroG751JTListMediasList =
    process.env.ALEJANDRO_G751JT_LIST_MEDIAS_LIST || "none";
  const alejandroG751JTListMediasList = [
    ...new Set(
      rawAlejandroG751JTListMediasList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isMediasList(alejandroG751JTListMediasList))
    throw new AppValidationError(
      `${alejandroG751JTListMediasList} is an invalid list of medias. Please provide ALEJANDRO_G751JT_LIST_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const alejandroG751JTListMediaNames = mediaNamesFromMediasList(
    alejandroG751JTListMediasList,
  );

  /*
   * ALEJANDRO_G751JT_DIFF_MEDIAS_LIST
   */
  const rawAlejandroG751JTDiffMediasList =
    process.env.ALEJANDRO_G751JT_DIFF_MEDIAS_LIST || "none";
  const alejandroG751JTDiffMediasList = [
    ...new Set(
      rawAlejandroG751JTDiffMediasList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isMediasList(alejandroG751JTDiffMediasList))
    throw new AppValidationError(
      `${alejandroG751JTDiffMediasList} is an invalid list of medias. Please provide ALEJANDRO_G751JT_DIFF_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const alejandroG751JTDiffMediaNames = mediaNamesFromMediasList(
    alejandroG751JTDiffMediasList,
  );

  /*
   * ALEJANDRO_G751JT_SYNC_MEDIAS_LIST
   */
  const rawAlejandroG751JTSyncMediasList =
    process.env.ALEJANDRO_G751JT_SYNC_MEDIAS_LIST || "none";
  const alejandroG751JTSyncMediasList = [
    ...new Set(
      rawAlejandroG751JTSyncMediasList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isMediasList(alejandroG751JTSyncMediasList))
    throw new AppValidationError(
      `${alejandroG751JTSyncMediasList} is an invalid list of medias. Please provide ALEJANDRO_G751JT_SYNC_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const alejandroG751JTSyncMediaNames = mediaNamesFromMediasList(
    alejandroG751JTSyncMediasList,
  );

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
  if (!typeGuards.isDeviceFileIOStrategy(steamDeckLCDAlejandroFileIOStrategy))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroFileIOStrategy} is not a valid File IO strategy. Please inject STEAM_DECK_LCD_ALEJANDRO_FILE_IO_STRATEGY with one of the following File IO strategies: ${DEVICE_FILE_IO_STRATEGIES.join(", ")}.`,
    );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_FILE_IO_FS_CRUD_STRATEGY
   */
  const steamDeckLCDAlejandroFileIoFsCrudStrategy =
    process.env.STEAM_DECK_LCD_ALEJANDRO_FILE_IO_FS_CRUD_STRATEGY || "copy";
  if (
    !typeGuards.isDeviceFileIOFsCrudStrategy(
      steamDeckLCDAlejandroFileIoFsCrudStrategy,
    )
  )
    throw new AppValidationError(
      `${steamDeckLCDAlejandroFileIoFsCrudStrategy} is not a valid FileIO.Fs strategy. Please inject STEAM_DECK_LCD_ALEJANDRO_FILE_IO_FS_CRUD_STRATEGY with one of the following FileIO.Fs strategies: ${DEVICE_FILE_IO_FS_CRUD_STRATEGIES.join(", ")}.`,
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

  /*
   * STEAM_DECK_LCD_ALEJANDRO_LIST_MEDIAS_LIST
   */
  const rawSteamDeckLCDAlejandroListMediasList =
    process.env.STEAM_DECK_LCD_ALEJANDRO_LIST_MEDIAS_LIST || "none";
  const steamDeckLCDAlejandroListMediasList = [
    ...new Set(
      rawSteamDeckLCDAlejandroListMediasList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isMediasList(steamDeckLCDAlejandroListMediasList))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroListMediasList} is an invalid list of medias. Please provide STEAM_DECK_LCD_ALEJANDRO_LIST_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const steamDeckLCDAlejandroListMediaNames = mediaNamesFromMediasList(
    steamDeckLCDAlejandroListMediasList,
  );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_DIFF_MEDIAS_LIST
   */
  const rawSteamDeckLCDAlejandroDiffMediasList =
    process.env.STEAM_DECK_LCD_ALEJANDRO_DIFF_MEDIAS_LIST || "none";
  const steamDeckLCDAlejandroDiffMediasList = [
    ...new Set(
      rawSteamDeckLCDAlejandroDiffMediasList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isMediasList(steamDeckLCDAlejandroDiffMediasList))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroDiffMediasList} is an invalid list of medias. Please provide STEAM_DECK_LCD_ALEJANDRO_DIFF_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const steamDeckLCDAlejandroDiffMediaNames = mediaNamesFromMediasList(
    steamDeckLCDAlejandroDiffMediasList,
  );

  /*
   * STEAM_DECK_LCD_ALEJANDRO_SYNC_MEDIAS_LIST
   */
  const rawSteamDeckLCDAlejandroSyncMediasList =
    process.env.STEAM_DECK_LCD_ALEJANDRO_SYNC_MEDIAS_LIST || "none";
  const steamDeckLCDAlejandroSyncMediasList = [
    ...new Set(
      rawSteamDeckLCDAlejandroSyncMediasList.split(",").map((s) => s.trim()),
    ),
  ];
  if (!typeGuards.isMediasList(steamDeckLCDAlejandroSyncMediasList))
    throw new AppValidationError(
      `${steamDeckLCDAlejandroSyncMediasList} is an invalid list of medias. Please provide STEAM_DECK_LCD_ALEJANDRO_SYNC_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const steamDeckLCDAlejandroSyncMediaNames = mediaNamesFromMediasList(
    steamDeckLCDAlejandroSyncMediasList,
  );

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
   * Filtered device's console and media names depending on mode
   */
  let alejandroG751JTConsoleNames: ConsoleName[];
  let alejandroG751JTMediaNames: MediaName[];
  let steamDeckLCDAlejandroConsoleNames: ConsoleName[];
  let steamDeckLCDAlejandroMediaNames: MediaName[];

  switch (mode) {
    case "diff": {
      alejandroG751JTConsoleNames = alejandroG751JTDiffConsoleNames;
      alejandroG751JTMediaNames = alejandroG751JTDiffMediaNames;
      steamDeckLCDAlejandroConsoleNames = steamDeckLCDAlejandroDiffConsoleNames;
      steamDeckLCDAlejandroMediaNames = steamDeckLCDAlejandroDiffMediaNames;
      break;
    }
    case "list": {
      alejandroG751JTConsoleNames = alejandroG751JTListConsoleNames;
      alejandroG751JTMediaNames = alejandroG751JTListMediaNames;
      steamDeckLCDAlejandroConsoleNames = steamDeckLCDAlejandroListConsoleNames;
      steamDeckLCDAlejandroMediaNames = steamDeckLCDAlejandroListMediaNames;
      break;
    }
    case "sync": {
      alejandroG751JTConsoleNames = alejandroG751JTSyncConsoleNames;
      alejandroG751JTMediaNames = alejandroG751JTSyncMediaNames;
      steamDeckLCDAlejandroConsoleNames = steamDeckLCDAlejandroSyncConsoleNames;
      steamDeckLCDAlejandroMediaNames = steamDeckLCDAlejandroSyncMediaNames;
      break;
    }
    case "diff-sync": {
      alejandroG751JTConsoleNames = intersectStringArraySimple(
        alejandroG751JTDiffConsoleNames,
        alejandroG751JTSyncConsoleNames,
      );
      alejandroG751JTMediaNames = intersectStringArraySimple(
        alejandroG751JTDiffMediaNames,
        alejandroG751JTSyncMediaNames,
      );
      steamDeckLCDAlejandroConsoleNames = intersectStringArraySimple(
        steamDeckLCDAlejandroDiffConsoleNames,
        steamDeckLCDAlejandroSyncConsoleNames,
      );
      steamDeckLCDAlejandroMediaNames = intersectStringArraySimple(
        steamDeckLCDAlejandroDiffMediaNames,
        steamDeckLCDAlejandroSyncMediaNames,
      );
      break;
    }
    case "sync-list": {
      alejandroG751JTConsoleNames = intersectStringArraySimple(
        alejandroG751JTSyncConsoleNames,
        alejandroG751JTListConsoleNames,
      );
      alejandroG751JTMediaNames = intersectStringArraySimple(
        alejandroG751JTSyncMediaNames,
        alejandroG751JTListMediaNames,
      );
      steamDeckLCDAlejandroConsoleNames = intersectStringArraySimple(
        steamDeckLCDAlejandroSyncConsoleNames,
        steamDeckLCDAlejandroListConsoleNames,
      );
      steamDeckLCDAlejandroMediaNames = intersectStringArraySimple(
        steamDeckLCDAlejandroSyncMediaNames,
        steamDeckLCDAlejandroListMediaNames,
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
      alejandroG751JTMediaNames = intersectStringArraySimple(
        alejandroG751JTDiffMediaNames,
        intersectStringArraySimple(
          alejandroG751JTSyncMediaNames,
          alejandroG751JTListMediaNames,
        ),
      );
      steamDeckLCDAlejandroConsoleNames = intersectStringArraySimple(
        steamDeckLCDAlejandroDiffConsoleNames,
        intersectStringArraySimple(
          steamDeckLCDAlejandroSyncConsoleNames,
          steamDeckLCDAlejandroListConsoleNames,
        ),
      );
      steamDeckLCDAlejandroMediaNames = intersectStringArraySimple(
        steamDeckLCDAlejandroDiffMediaNames,
        intersectStringArraySimple(
          steamDeckLCDAlejandroSyncMediaNames,
          steamDeckLCDAlejandroListMediaNames,
        ),
      );
      break;
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
          console: {
            names: alejandroG751JTConsoleNames,
          },
          media: {
            names: alejandroG751JTMediaNames,
          },
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
          console: {
            names: steamDeckLCDAlejandroConsoleNames,
          },
          media: {
            names: steamDeckLCDAlejandroMediaNames,
          },
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
