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
   * MODE
   */
  const mode = process.env.MODE || "diff-sync";
  if (!typeGuards.isModeName(mode))
    throw new AppValidationError(
      `${mode} is an invalid mode. Please feed MODE one from the following modes: ${MODE_NAMES.join(", ")}.`,
    );

  /*
   * LIST_DEVICES_LIST
   */
  const rawListDevicesList = process.env.LIST_DEVICES_LIST || "local";
  const listDevicesList = [
    ...new Set(rawListDevicesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isDevicesList(listDevicesList))
    throw new AppValidationError(
      `${listDevicesList} is an invalid list of devices. Please provide LIST_DEVICES_LIST a comma-separated list of valid devices: ${DEVICE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all devices respectively.`,
    );
  const listDeviceNames = deviceNamesFromDevicesList(listDevicesList);

  /*
   * LOCAL_LIST_CONSOLES_LIST
   */
  const rawLocalListConsolesList =
    process.env.LOCAL_LIST_CONSOLES_LIST || "all";
  const localListConsolesList = [
    ...new Set(rawLocalListConsolesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isConsolesList(localListConsolesList))
    throw new AppValidationError(
      `${localListConsolesList} is an invalid list of consoles. Please provide LOCAL_LIST_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const localListConsoleNames = consoleNamesFromConsolesList(
    localListConsolesList,
  );

  /*
   * STEAM_DECK_LIST_CONSOLES_LIST
   */
  const rawSteamDeckListConsolesList =
    process.env.STEAM_DECK_LIST_CONSOLES_LIST || "all";
  const steamDeckListConsolesList = [
    ...new Set(rawSteamDeckListConsolesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isConsolesList(steamDeckListConsolesList))
    throw new AppValidationError(
      `${steamDeckListConsolesList} is an invalid list of consoles. Please provide STEAM_DECK_LIST_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const steamDeckListConsoleNames = consoleNamesFromConsolesList(
    steamDeckListConsolesList,
  );

  /*
   * STEAM_DECK_LIST_MEDIAS_LIST
   */
  const rawSteamDeckListMediasList =
    process.env.STEAM_DECK_LIST_MEDIAS_LIST || "all";
  const steamDeckListMediasList = [
    ...new Set(rawSteamDeckListMediasList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isMediasList(steamDeckListMediasList))
    throw new AppValidationError(
      `${steamDeckListMediasList} is an invalid list of medias. Please provide STEAM_DECK_LIST_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const steamDeckListMediaNames = mediaNamesFromMediasList(
    steamDeckListMediasList,
  );

  /*
   * DIFF_DEVICES_LIST
   */
  const rawDiffDevicesList =
    process.env.DIFF_DEVICES_LIST || "local,steam-deck";
  const diffDevicesList = [
    ...new Set(rawDiffDevicesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isDevicesList(diffDevicesList))
    throw new AppValidationError(
      `${diffDevicesList} is an invalid list of devices. Please provide DIFF_DEVICES_LIST a comma-separated list of valid devices: ${DEVICE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all devices respectively.`,
    );
  const diffDeviceNames = deviceNamesFromDevicesList(diffDevicesList);

  /*
   * LOCAL_DIFF_CONSOLES_LIST
   */
  const rawLocalDiffConsolesList =
    process.env.LOCAL_DIFF_CONSOLES_LIST || "all";
  const localDiffConsolesList = [
    ...new Set(rawLocalDiffConsolesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isConsolesList(localDiffConsolesList))
    throw new AppValidationError(
      `${localDiffConsolesList} is an invalid list of consoles. Please provide LOCAL_DIFF_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const localDiffConsoleNames = consoleNamesFromConsolesList(
    localDiffConsolesList,
  );

  /*
   * STEAM_DECK_DIFF_CONSOLES_LIST
   */
  const rawSteamDeckDiffConsolesList =
    process.env.STEAM_DECK_DIFF_CONSOLES_LIST || "all";
  const steamDeckDiffConsolesList = [
    ...new Set(rawSteamDeckDiffConsolesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isConsolesList(steamDeckDiffConsolesList))
    throw new AppValidationError(
      `${steamDeckDiffConsolesList} is an invalid list of consoles. Please provide STEAM_DECK_DIFF_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const steamDeckDiffConsoleNames = consoleNamesFromConsolesList(
    steamDeckDiffConsolesList,
  );

  /*
   * STEAM_DECK_DIFF_MEDIAS_LIST
   */
  const rawSteamDeckDiffMediasList =
    process.env.STEAM_DECK_DIFF_MEDIAS_LIST || "all";
  const steamDeckDiffMediasList = [
    ...new Set(rawSteamDeckDiffMediasList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isMediasList(steamDeckDiffMediasList))
    throw new AppValidationError(
      `${steamDeckDiffMediasList} is an invalid list of medias. Please provide STEAM_DECK_DIFF_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const steamDeckDiffMediaNames = mediaNamesFromMediasList(
    steamDeckDiffMediasList,
  );

  /*
   * SIMULATE_SYNC
   */
  const rawSimulateSync = process.env.SIMULATE_SYNC || "1";
  if (!validation.isStringZeroOrOne(rawSimulateSync))
    throw new AppValidationError(`SIMULATE_SYNC must be either a 0 or a 1.`);
  const simulateSync = +rawSimulateSync === 1 ? true : false;

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
   * LOCAL_SYNC_CONSOLES_LIST
   */
  const rawLocalSyncConsolesList =
    process.env.LOCAL_SYNC_CONSOLES_LIST || "none";
  const localSyncConsolesList = [
    ...new Set(rawLocalSyncConsolesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isConsolesList(localSyncConsolesList))
    throw new AppValidationError(
      `${localSyncConsolesList} is an invalid list of consoles. Please provide LOCAL_SYNC_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const localSyncConsoleNames = consoleNamesFromConsolesList(
    localSyncConsolesList,
  );

  /*
   * STEAM_DECK_SYNC_CONSOLES_LIST
   */
  const rawSteamDeckSyncConsolesList =
    process.env.STEAM_DECK_SYNC_CONSOLES_LIST || "none";
  const steamDeckSyncConsolesList = [
    ...new Set(rawSteamDeckSyncConsolesList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isConsolesList(steamDeckSyncConsolesList))
    throw new AppValidationError(
      `${steamDeckSyncConsolesList} is an invalid list of consoles. Please provide STEAM_DECK_SYNC_CONSOLES_LIST a comma-separated list of valid consoles: ${CONSOLE_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all consoles respectively.`,
    );
  const steamDeckSyncConsoleNames = consoleNamesFromConsolesList(
    steamDeckSyncConsolesList,
  );

  /*
   * STEAM_DECK_SYNC_MEDIAS_LIST
   */
  const rawSteamDeckSyncMediasList =
    process.env.STEAM_DECK_SYNC_MEDIAS_LIST || "none";
  const steamDeckSyncMediasList = [
    ...new Set(rawSteamDeckSyncMediasList.split(",").map((s) => s.trim())),
  ];
  if (!typeGuards.isMediasList(steamDeckSyncMediasList))
    throw new AppValidationError(
      `${steamDeckSyncMediasList} is an invalid list of medias. Please provide STEAM_DECK_SYNC_MEDIAS_LIST a comma-separated list of valid medias: ${MEDIA_NAMES.join(", ")}. For convenience, use either "none" or "all" to select none or all medias respectively.`,
    );
  const steamDeckSyncMediaNames = mediaNamesFromMediasList(
    steamDeckSyncMediasList,
  );

  /*
   * ROMS_DATABASE_DIR_PATH
   */
  const romsDatabaseDirPath = process.env.ROMS_DATABASE_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(romsDatabaseDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the ROMS_DATABASE_DIR_PATH environment variable.",
    );

  /*
   * MEDIA_DATABASE_DIR_PATH
   */
  const mediaDatabaseDirPath = process.env.MEDIA_DATABASE_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(mediaDatabaseDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the MEDIA_DATABASE_DIR_PATH environment variable.",
    );

  /*
   * METADATA_DATABASE_DIR_PATH
   */
  const metadataDatabaseDirPath = process.env.METADATA_DATABASE_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(metadataDatabaseDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the METADATA_DATABASE_DIR_PATH environment variable.",
    );

  /*
   * LOCAL_ROMS_DIR_PATH
   */
  const localRomsDirPath = process.env.LOCAL_ROMS_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(localRomsDirPath))
    throw new AppValidationError(
      "LOCAL_ROMS_DIR_PATH must be a valid Unix path.",
    );

  /*
   * STEAM_DECK_REMOTE_ROMS_DIR_PATH
   */
  const steamDeckRemoteRomsDirPath =
    process.env.STEAM_DECK_REMOTE_ROMS_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(steamDeckRemoteRomsDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the STEAM_DECK_REMOTE_ROMS_DIR_PATH environment variable.",
    );

  /*
   * STEAM_DECK_REMOTE_MEDIA_DIR_PATH
   */
  const steamDeckRemoteMediaDirPath =
    process.env.STEAM_DECK_REMOTE_MEDIA_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(steamDeckRemoteMediaDirPath))
    throw new AppValidationError(
      "STEAM_DECK_REMOTE_MEDIA_DIR_PATH must be a valid Unix path.",
    );

  /*
   * STEAM_DECK_REMOTE_METADATA_DIR_PATH
   */
  const steamDeckRemoteMetadataDirPath =
    process.env.STEAM_DECK_REMOTE_METADATA_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(steamDeckRemoteMetadataDirPath))
    throw new AppValidationError(
      "STEAM_DECK_REMOTE_METADATA_DIR_PATH must be a valid Unix path.",
    );

  /*
   * STEAM_DECK_HOST
   */
  const steamDeckHost = process.env.STEAM_DECK_HOST || "";
  if (!isStringIpv4Address(steamDeckHost))
    throw new AppValidationError(
      "STEAM_DECK_HOST must be a valid IPv4 address.",
    );

  /*
   * STEAM_DECK_PORT
   */
  const rawSteamDeckPort = process.env.STEAM_DECK_PORT || "";
  if (!validation.isStringPort(rawSteamDeckPort))
    throw new AppValidationError(
      "STEAM_DECK_PORT must be a valid port [0-65535].",
    );
  const steamDeckPort = +rawSteamDeckPort;

  /*
   * STEAM_DECK_USERNAME
   */
  const steamDeckUsername = process.env.STEAM_DECK_USERNAME || "";

  /*
   * STEAM_DECK_PASSWORD
   */
  const steamDeckPassword = process.env.STEAM_DECK_PASSWORD || "";

  /*
   * Computed Environment Variables
   */

  /*
   * Lists for special `diff-sync` mode
   */

  const diffSyncDeviceNames = intersectStringArraySimple(
    diffDeviceNames,
    syncDeviceNames,
  );
  const localDiffSyncConsoleNames = intersectStringArraySimple(
    localDiffConsoleNames,
    localSyncConsoleNames,
  );
  const steamDeckDiffSyncConsoleNames = intersectStringArraySimple(
    steamDeckDiffConsoleNames,
    steamDeckSyncConsoleNames,
  );
  const steamDeckDiffSyncMediaNames = intersectStringArraySimple(
    steamDeckDiffMediaNames,
    steamDeckSyncMediaNames,
  );

  /*
   * Lists for special `sync-list` mode
   */
  const syncListDeviceNames = intersectStringArraySimple(
    syncDeviceNames,
    listDeviceNames,
  );
  const localSyncListConsoleNames = intersectStringArraySimple(
    localSyncConsoleNames,
    localListConsoleNames,
  );
  const steamDeckSyncListConsoleNames = intersectStringArraySimple(
    steamDeckSyncConsoleNames,
    steamDeckListConsoleNames,
  );
  const steamDeckSyncListMediaNames = intersectStringArraySimple(
    steamDeckSyncMediaNames,
    steamDeckListMediaNames,
  );

  /*
   * Lists for special `diff-sync-list` and `list-diff-sync-list` modes
   */
  const diffSyncListDeviceNames = intersectStringArraySimple(
    diffDeviceNames,
    syncListDeviceNames,
  );
  const localDiffSyncListConsoleNames = intersectStringArraySimple(
    localDiffConsoleNames,
    localSyncListConsoleNames,
  );
  const steamDeckDiffSyncListConsoleNames = intersectStringArraySimple(
    steamDeckDiffConsoleNames,
    steamDeckSyncListConsoleNames,
  );
  const steamDeckDiffSyncListMediaNames = intersectStringArraySimple(
    steamDeckDiffMediaNames,
    steamDeckSyncListMediaNames,
  );

  return {
    options: {
      log: {
        level: logLevel,
      },
      mode,
    },
    paths: {
      db: {
        roms: romsDatabaseDirPath,
        media: mediaDatabaseDirPath,
        metadata: metadataDatabaseDirPath,
      },
    },
    modes: {
      list: {
        devices: listDeviceNames,
      },
      diff: {
        devices: diffDeviceNames,
      },
      sync: {
        devices: syncDeviceNames,
      },
      "diff-sync": {
        devices: diffSyncDeviceNames,
      },
      "sync-list": {
        devices: syncListDeviceNames,
      },
      "diff-sync-list": {
        devices: diffSyncListDeviceNames,
      },
      "list-diff-sync-list": {
        devices: diffSyncListDeviceNames,
      },
    },
    devices: {
      local: {
        paths: {
          roms: localRomsDirPath,
        },
        modes: {
          list: {
            consoles: localListConsoleNames,
          },
          diff: {
            consoles: localDiffConsoleNames,
          },
          sync: {
            simulate: simulateSync,
            consoles: localSyncConsoleNames,
          },
          "diff-sync": {
            simulate: simulateSync,
            consoles: localDiffSyncConsoleNames,
          },
          "sync-list": {
            simulate: simulateSync,
            consoles: localSyncListConsoleNames,
          },
          "diff-sync-list": {
            simulate: simulateSync,
            consoles: localDiffSyncListConsoleNames,
          },
          "list-diff-sync-list": {
            simulate: simulateSync,
            consoles: localDiffSyncListConsoleNames,
          },
        },
      },
      "steam-deck": {
        paths: {
          roms: steamDeckRemoteRomsDirPath,
          media: steamDeckRemoteMediaDirPath,
          metadata: steamDeckRemoteMetadataDirPath,
        },
        modes: {
          list: {
            consoles: steamDeckListConsoleNames,
            medias: steamDeckListMediaNames,
          },
          diff: {
            consoles: steamDeckDiffConsoleNames,
            medias: steamDeckDiffMediaNames,
          },
          sync: {
            simulate: simulateSync,
            consoles: steamDeckSyncConsoleNames,
            medias: steamDeckSyncMediaNames,
          },
          "diff-sync": {
            simulate: simulateSync,
            consoles: steamDeckDiffSyncConsoleNames,
            medias: steamDeckDiffSyncMediaNames,
          },
          "sync-list": {
            simulate: simulateSync,
            consoles: steamDeckSyncListConsoleNames,
            medias: steamDeckSyncListMediaNames,
          },
          "diff-sync-list": {
            simulate: simulateSync,
            consoles: steamDeckDiffSyncListConsoleNames,
            medias: steamDeckDiffSyncListMediaNames,
          },
          "list-diff-sync-list": {
            simulate: simulateSync,
            consoles: steamDeckDiffSyncListConsoleNames,
            medias: steamDeckDiffSyncListMediaNames,
          },
        },
        sftp: {
          credentials: {
            host: steamDeckHost,
            port: steamDeckPort,
            username: steamDeckUsername,
            password: steamDeckPassword,
          },
        },
      },
    },
  };
};

export default environmentFromProcessVariables;
