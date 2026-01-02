import type { Environment } from "../../types.js";

const environmentFromProcessVariables = (): Environment => {
  const rawReplaceLists = process.env.REPLACE_LISTS;
  if (!rawReplaceLists)
    throw new Error(
      "Please assign a value to REPLACE_LISTS environment variable.",
    );
  const isRawReplaceListsValid = /^[0-1]{1}$/.test(rawReplaceLists);
  if (!isRawReplaceListsValid)
    throw new Error("REPLACE_VALUE must be either a 0 or a 1.");

  const replaceLists = +rawReplaceLists === 1 ? true : false;

  const rawConnectToSteamDeck = process.env.CONNECT_TO_STEAM_DECK;
  if (!rawConnectToSteamDeck)
    throw new Error(
      "Please assign a value to CONNECT_TO_STEAM_DECK environment variable.",
    );
  const isRawConnectToSteamDeckValid = /^[0-1]{1}$/.test(rawConnectToSteamDeck);
  if (!isRawConnectToSteamDeckValid)
    throw new Error("CONNECT_TO_STEAM_DECK must be either a 0 or a 1.");

  const connectToSteamDeck = +rawConnectToSteamDeck === 1 ? true : false;

  const steamDeckHost = process.env.STEAM_DECK_HOST;
  if (connectToSteamDeck && !steamDeckHost)
    throw new Error(
      "Please assign a value to STEAM_DECK_HOST environment variable.",
    );
  if (connectToSteamDeck && steamDeckHost) {
    const isSteamDeckHostValid =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        steamDeckHost,
      );
    if (!isSteamDeckHostValid)
      throw new Error("STEAM_DECK_HOST must be a valid IPv4 address.");
  }

  const rawSteamDeckPort = process.env.STEAM_DECK_PORT;
  let steamDeckPort = 0;

  if (connectToSteamDeck && !rawSteamDeckPort)
    throw new Error(
      "Please assign a value to STEAM_DECK_PORT environment variable.",
    );
  if (rawSteamDeckPort) {
    const isSteamDeckPortANumber = /^[0-9]+$/.test(rawSteamDeckPort);
    if (!isSteamDeckPortANumber)
      throw new Error("STEAM_DECK_PORT must be a number.");

    steamDeckPort = +rawSteamDeckPort;

    if (connectToSteamDeck) {
      const isSteamDeckPortInRange =
        steamDeckPort >= 1 && steamDeckPort <= 65535;
      if (!isSteamDeckPortInRange)
        throw new Error("STEAM_DECK_PORT must be a valid port [0-65535].");
    }
  }

  const steamDeckUsername = process.env.STEAM_DECK_USERNAME || "";
  if (connectToSteamDeck && steamDeckUsername.length === 0)
    throw new Error(
      "Please assign a value to STEAM_DECK_USERNAME environment variable.",
    );

  const steamDeckPassword = process.env.STEAM_DECK_PASSWORD || "";
  if (connectToSteamDeck && steamDeckPassword.length === 0)
    throw new Error(
      "Please assign a value to STEAM_DECK_PASSWORD environment variable.",
    );

  return {
    files: {
      replaceLists: replaceLists || connectToSteamDeck,
    },
    sftp: {
      connectToSteamDeck,
      credentials: {
        steamDeck: {
          host: steamDeckHost || "",
          port: steamDeckPort,
          username: steamDeckUsername,
          password: steamDeckPassword,
        },
      },
    },
  };
};

export default environmentFromProcessVariables;
