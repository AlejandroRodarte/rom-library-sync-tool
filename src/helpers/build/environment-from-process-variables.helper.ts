import AppNotFoundError from "../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import DEVICE_NAMES from "../../constants/device-names.constant.js";
import type { Environment } from "../../types.js";
import typeGuards from "../typescript/guards/index.js";

const environmentFromProcessVariables = (): Environment => {
  const rawSyncDevicesList = process.env.SYNC_DEVICES_LIST;
  if (!rawSyncDevicesList)
    throw new AppNotFoundError(
      "Please assign a value to the SYNC_DEVICES_LIST environment variable.",
    );

  const devicesList = [...new Set(rawSyncDevicesList.split(","))];

  let syncLocal = false;
  let syncSteamDeck = false;

  for (const device of devicesList) {
    if (device === "none") {
      syncLocal = false;
      syncSteamDeck = false;
      break;
    } else if (typeGuards.isDeviceName(device)) {
      switch (device) {
        case "local":
          syncLocal = true;
          break;
        case "steam-deck":
          syncSteamDeck = true;
          break;
      }
    } else
      throw new AppWrongTypeError(
        `Device ${device} is unrecognized. Please feed SYNC_DEVICES_LIST a comma-separated list of valid devices. Valid devices are: ${DEVICE_NAMES.join(", ")}.`,
      );
  }

  const romsDatabaseDirPath = process.env.ROMS_DATABASE_DIR_PATH;
  if (!romsDatabaseDirPath)
    throw new AppNotFoundError(
      "Please provide a valid path to the ROMS_DATABASE_DIR_PATH environment variable.",
    );

  const isRomsDatabaseDirPathValid = /^[^\0]+$/.test(romsDatabaseDirPath);
  if (!isRomsDatabaseDirPathValid)
    throw new AppValidationError(
      "ROMS_DATABASE_DIR_PATH must be a valid Unix path.",
    );

  const mediaDatabaseDirPath = process.env.MEDIA_DATABASE_DIR_PATH;
  if (!mediaDatabaseDirPath)
    throw new AppNotFoundError(
      "Please provide a valid path to the MEDIA_DATABASE_DIR_PATH environment variable.",
    );

  const isMediaDatabaseDirPathValid = /^[^\0]+$/.test(mediaDatabaseDirPath);
  if (!isMediaDatabaseDirPathValid)
    throw new AppValidationError(
      "MEDIA_DATABASE_DIR_PATH must be a valid Unix path.",
    );

  const rawLocalConsolesList = process.env.LOCAL_CONSOLES_LIST;
  if (!rawLocalConsolesList)
    throw new AppNotFoundError(
      "Please assign a value to the LOCAL_CONSOLES_LIST environment variable.",
    );

  const localConsolesList = rawLocalConsolesList.split(",");
  if (!typeGuards.isConsoleList(localConsolesList))
    throw new AppWrongTypeError(
      `Please feed LOCAL_CONSOLES_LIST a comma-separated list of valid console entries. Valid consoles: ${CONSOLE_NAMES.join(", ")}.`,
    );

  const rawSteamDeckConsolesList = process.env.STEAM_DECK_CONSOLES_LIST;
  if (!rawSteamDeckConsolesList)
    throw new AppNotFoundError(
      "Please assign a value to the STEAM_DECK_CONSOLES_LIST environment variable.",
    );

  const steamDeckConsolesList = rawSteamDeckConsolesList.split(",");
  if (!typeGuards.isConsoleList(steamDeckConsolesList))
    throw new AppWrongTypeError(
      `Please feed STEAM_DECK_CONSOLES_LIST a comma-separated list of valid console entries. Valid consoles: ${CONSOLE_NAMES.join(", ")}.`,
    );

  const steamDeckHost = process.env.STEAM_DECK_HOST;
  if (!steamDeckHost)
    throw new AppNotFoundError(
      "Please assign a value to STEAM_DECK_HOST environment variable.",
    );
  const isSteamDeckHostValid =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      steamDeckHost,
    );
  if (!isSteamDeckHostValid)
    throw new AppValidationError(
      "STEAM_DECK_HOST must be a valid IPv4 address.",
    );

  const rawSteamDeckPort = process.env.STEAM_DECK_PORT;
  if (!rawSteamDeckPort)
    throw new AppNotFoundError(
      "Please assign a value to STEAM_DECK_PORT environment variable.",
    );
  const isSteamDeckPortANumber = /^[0-9]+$/.test(rawSteamDeckPort);
  if (!isSteamDeckPortANumber)
    throw new AppValidationError("STEAM_DECK_PORT must be a number.");
  const steamDeckPort = +rawSteamDeckPort;
  const isSteamDeckPortInRange = steamDeckPort >= 1 && steamDeckPort <= 65535;
  if (!isSteamDeckPortInRange)
    throw new AppValidationError(
      "STEAM_DECK_PORT must be a valid port [0-65535].",
    );

  const steamDeckUsername = process.env.STEAM_DECK_USERNAME;
  if (!steamDeckUsername)
    throw new AppNotFoundError(
      "Please assign a value to STEAM_DECK_USERNAME environment variable.",
    );

  const steamDeckPassword = process.env.STEAM_DECK_PASSWORD;
  if (!steamDeckPassword)
    throw new AppNotFoundError(
      "Please assign a value to STEAM_DECK_PASSWORD environment variable.",
    );

  const localRomsDirPath = process.env.LOCAL_ROMS_DIR_PATH;
  if (!localRomsDirPath)
    throw new AppNotFoundError(
      "Please provide a valid path to the LOCAL_ROMS_DIR_PATH environment variable.",
    );

  const isLocalRomsDirPathValid = /^[^\0]+$/.test(localRomsDirPath);
  if (!isLocalRomsDirPathValid)
    throw new AppValidationError(
      "LOCAL_ROMS_DIR_PATH must be a valid Unix path.",
    );

  const steamDeckRemoteRomsDirPath =
    process.env.STEAM_DECK_REMOTE_ROMS_DIR_PATH;
  if (!steamDeckRemoteRomsDirPath)
    throw new AppNotFoundError(
      "Please provide a valid path to the STEAM_DECK_REMOTE_ROMS_DIR_PATH environment variable.",
    );

  const isSteamDeckRemoteRomsDirPathValid = /^[^\0]+$/.test(
    steamDeckRemoteRomsDirPath,
  );
  if (!isSteamDeckRemoteRomsDirPathValid)
    throw new AppValidationError(
      "STEAM_DECK_REMOTE_ROMS_DIR_PATH must be a valid Unix path.",
    );

  const steamDeckRemoteMediaDirPath =
    process.env.STEAM_DECK_REMOTE_MEDIA_DIR_PATH;
  if (!steamDeckRemoteMediaDirPath)
    throw new AppNotFoundError(
      "Please provide a valid path to the STEAM_DECK_REMOTE_MEDIA_DIR_PATH environment variable.",
    );

  const isSteamDeckRemoteMediaDirPathValid = /^[^\0]+$/.test(
    steamDeckRemoteMediaDirPath,
  );
  if (!isSteamDeckRemoteMediaDirPathValid)
    throw new AppValidationError(
      "STEAM_DECK_REMOTE_MEDIA_DIR_PATH must be a valid Unix path.",
    );
  return {
    paths: {
      dbs: {
        roms: romsDatabaseDirPath,
        media: mediaDatabaseDirPath,
      },
    },
    devices: {
      local: {
        sync: syncLocal,
        paths: {
          roms: localRomsDirPath,
        },
        consoles: localConsolesList,
      },
      steamDeck: {
        sync: syncSteamDeck,
        paths: {
          roms: steamDeckRemoteRomsDirPath,
          media: steamDeckRemoteMediaDirPath,
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
