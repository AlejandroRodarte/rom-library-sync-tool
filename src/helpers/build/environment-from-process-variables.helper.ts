import type { Environment } from "../../types.js";

const environmentFromProcessVariables = (): Environment => {
  const rawUpdateLocal = process.env.UPDATE_LOCAL;
  if (!rawUpdateLocal)
    throw new Error(
      "Please assign a value to UPDATE_LOCAL environment variable.",
    );
  const isRawUpdateLocalValid = /^[0-1]{1}$/.test(rawUpdateLocal);
  if (!isRawUpdateLocalValid)
    throw new Error("UPDATE_LOCAL must be either a 0 or a 1.");
  const updateLocal = +rawUpdateLocal === 1 ? true : false;

  const rawUpdateSteamDeck = process.env.UPDATE_STEAM_DECK;
  if (!rawUpdateSteamDeck)
    throw new Error(
      "Please assign a value to UPDATE_STEAM_DECK environment variable.",
    );
  const isRawUpdateSteamDeckValid = /^[0-1]{1}$/.test(rawUpdateSteamDeck);
  if (!isRawUpdateSteamDeckValid)
    throw new Error("UPDATE_STEAM_DECK must be either a 0 or a 1.");
  const updateSteamDeck = +rawUpdateSteamDeck === 1 ? true : false;

  const steamDeckHost = process.env.STEAM_DECK_HOST;
  if (!steamDeckHost)
    throw new Error(
      "Please assign a value to STEAM_DECK_HOST environment variable.",
    );
  const isSteamDeckHostValid =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      steamDeckHost,
    );
  if (!isSteamDeckHostValid)
    throw new Error("STEAM_DECK_HOST must be a valid IPv4 address.");

  const rawSteamDeckPort = process.env.STEAM_DECK_PORT;
  if (!rawSteamDeckPort)
    throw new Error(
      "Please assign a value to STEAM_DECK_PORT environment variable.",
    );
  const isSteamDeckPortANumber = /^[0-9]+$/.test(rawSteamDeckPort);
  if (!isSteamDeckPortANumber)
    throw new Error("STEAM_DECK_PORT must be a number.");
  const steamDeckPort = +rawSteamDeckPort;
  const isSteamDeckPortInRange = steamDeckPort >= 1 && steamDeckPort <= 65535;
  if (!isSteamDeckPortInRange)
    throw new Error("STEAM_DECK_PORT must be a valid port [0-65535].");

  const steamDeckUsername = process.env.STEAM_DECK_USERNAME;
  if (!steamDeckUsername)
    throw new Error(
      "Please assign a value to STEAM_DECK_USERNAME environment variable.",
    );

  const steamDeckPassword = process.env.STEAM_DECK_PASSWORD;
  if (!steamDeckPassword)
    throw new Error(
      "Please assign a value to STEAM_DECK_PASSWORD environment variable.",
    );

  return {
    devices: {
      local: {
        update: updateLocal,
      },
      steamDeck: {
        update: updateSteamDeck,
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
