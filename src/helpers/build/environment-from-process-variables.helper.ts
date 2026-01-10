import AppNotFoundError from "../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import DEVICE_NAMES from "../../constants/device-names.constant.js";
import type { DeviceName, Environment } from "../../types.js";
import typeGuards from "../typescript/guards/index.js";
import validation from "../validation/index.js";
import isStringIpv4Address from "../validation/is-string-ipv4-address.helper.js";
import build from "./index.js";

const environmentFromProcessVariables = (): Environment => {
  const rawSimulateSync = process.env.SIMULATE_SYNC || "";
  if (!validation.isStringZeroOrOne(rawSimulateSync))
    throw new AppValidationError(`SIMULATE_SYNC must be either a 0 or a 1.`);
  const simulateSync = +rawSimulateSync === 1 ? true : false;

  const rawFilterDevicesList = process.env.FILTER_DEVICES_LIST || "";
  const filterDevicesList = [...new Set(rawFilterDevicesList.split(","))];
  if (!typeGuards.isDevicesList(filterDevicesList))
    throw new AppValidationError(
      `${filterDevicesList} is not a valid list of devices. Please provide FILTER_DEVICES_LIST with a comma-separated list of valid devices. Valid devices are: ${DEVICE_NAMES.join(", ")}. For convenience, use "none" and "all" to choose either no or all devices.`,
    );
  const filterDeviceNames =
    build.deviceNamesFromFilterDevicesList(filterDevicesList);

  const rawSyncDevicesList = process.env.SYNC_DEVICES_LIST || "";
  const syncDevicesList = [...new Set(rawSyncDevicesList.split(","))];
  if (!typeGuards.isDevicesList(syncDevicesList))
    throw new AppValidationError(
      `${filterDevicesList} is not a valid list of devices. Please provide SYNC_DEVICES_LIST with a comma-separated list of valid devices. Valid devices are: ${DEVICE_NAMES.join(", ")}. For convenience, use "none" and "all" to choose either no or all devices.`,
    );
  const syncDeviceNames = build.deviceNamesFromSyncDevicesList(
    syncDevicesList,
    filterDeviceNames,
  );

  const romsDatabaseDirPath = process.env.ROMS_DATABASE_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(romsDatabaseDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the ROMS_DATABASE_DIR_PATH environment variable.",
    );

  const mediaDatabaseDirPath = process.env.MEDIA_DATABASE_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(mediaDatabaseDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the MEDIA_DATABASE_DIR_PATH environment variable.",
    );

  const gamelistsDatabaseDirPath =
    process.env.GAMELISTS_DATABASE_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(gamelistsDatabaseDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the GAMELISTS_DATABASE_DIR_PATH environment variable.",
    );

  const rawLocalConsolesList = process.env.LOCAL_CONSOLES_LIST || "";
  const localConsolesList = rawLocalConsolesList
    .split(",")
    .map((s) => s.trim());
  if (!typeGuards.isConsoleList(localConsolesList))
    throw new AppWrongTypeError(
      `Please feed LOCAL_CONSOLES_LIST a comma-separated list of valid console entries. Valid consoles: ${CONSOLE_NAMES.join(", ")}.`,
    );

  const rawSteamDeckConsolesList = process.env.STEAM_DECK_CONSOLES_LIST || "";
  const steamDeckConsolesList = rawSteamDeckConsolesList
    .split(",")
    .map((s) => s.trim());
  if (!typeGuards.isConsoleList(steamDeckConsolesList))
    throw new AppWrongTypeError(
      `Please feed STEAM_DECK_CONSOLES_LIST a comma-separated list of valid console entries. Valid consoles: ${CONSOLE_NAMES.join(", ")}.`,
    );

  const steamDeckHost = process.env.STEAM_DECK_HOST || "";
  if (!isStringIpv4Address(steamDeckHost))
    throw new AppValidationError(
      "STEAM_DECK_HOST must be a valid IPv4 address.",
    );

  const rawSteamDeckPort = process.env.STEAM_DECK_PORT || "";
  if (!validation.isStringPort(rawSteamDeckPort))
    throw new AppValidationError(
      "STEAM_DECK_PORT must be a valid port [0-65535].",
    );
  const steamDeckPort = +rawSteamDeckPort;

  const steamDeckUsername = process.env.STEAM_DECK_USERNAME || "";
  const steamDeckPassword = process.env.STEAM_DECK_PASSWORD || "";

  const localRomsDirPath = process.env.LOCAL_ROMS_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(localRomsDirPath))
    throw new AppValidationError(
      "LOCAL_ROMS_DIR_PATH must be a valid Unix path.",
    );

  const steamDeckRemoteRomsDirPath =
    process.env.STEAM_DECK_REMOTE_ROMS_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(steamDeckRemoteRomsDirPath))
    throw new AppNotFoundError(
      "Please provide a valid path to the STEAM_DECK_REMOTE_ROMS_DIR_PATH environment variable.",
    );

  const steamDeckRemoteMediaDirPath =
    process.env.STEAM_DECK_REMOTE_MEDIA_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(steamDeckRemoteMediaDirPath))
    throw new AppValidationError(
      "STEAM_DECK_REMOTE_MEDIA_DIR_PATH must be a valid Unix path.",
    );

  const steamDeckRemoteGamelistsDirPath =
    process.env.STEAM_DECK_REMOTE_GAMELISTS_DIR_PATH || "";
  if (!validation.isStringAbsoluteUnixPath(steamDeckRemoteGamelistsDirPath))
    throw new AppValidationError(
      "STEAM_DECK_REMOTE_GAMELISTS_DIR_PATH must be a valid Unix path.",
    );

  return {
    options: {
      sync: {
        simulate: simulateSync,
        devices: syncDeviceNames,
      },
      filter: {
        devices: filterDeviceNames,
      },
    },
    paths: {
      dbs: {
        roms: romsDatabaseDirPath,
        media: mediaDatabaseDirPath,
        gamelists: gamelistsDatabaseDirPath,
      },
    },
    devices: {
      local: {
        sync: syncDeviceNames.includes("local"),
        paths: {
          roms: localRomsDirPath,
        },
        consoles: localConsolesList,
      },
      "steam-deck": {
        sync: syncDeviceNames.includes("steam-deck"),
        paths: {
          roms: steamDeckRemoteRomsDirPath,
          media: steamDeckRemoteMediaDirPath,
          gamelists: steamDeckRemoteGamelistsDirPath,
        },
        sftp: {
          credentials: {
            host: steamDeckHost,
            port: steamDeckPort,
            username: steamDeckUsername,
            password: steamDeckPassword,
          },
        },
        consoles: steamDeckConsolesList,
      },
    },
  };
};

export default environmentFromProcessVariables;
