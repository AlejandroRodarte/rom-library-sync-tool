import environment from "./objects/environment.object.js";
import logger from "./objects/logger.object.js";
import modes from "./helpers/modes/index.js";
import type { Device } from "./interfaces/device.interface.js";
import Local from "./classes/devices/local.class.js";
import SteamDeck from "./classes/devices/steam-deck.class.js";
import type { Debug } from "./interfaces/debug.interface.js";

const main = async () => {
  logger.trace("main() function starts");

  const mode = environment.options.mode;
  logger.debug(`Mode: ${mode}`);

  const devices: (Device & Debug)[] = [];

  let local: Local | undefined;
  let steamDeck: SteamDeck | undefined;

  if (environment.modes[mode].devices.includes("local")) {
    logger.trace("Creating and adding Local device");

    local = new Local(environment.devices.local.modes[mode].consoles);
    devices.push(local);

    logger.debug(local.debug());
  }

  if (environment.modes[mode].devices.includes("steam-deck")) {
    logger.trace("Creating and adding Steam Deck device");

    steamDeck = new SteamDeck(
      environment.devices["steam-deck"].modes[mode].consoles,
      environment.devices["steam-deck"].modes[mode].medias,
      environment.devices["steam-deck"].sftp.credentials,
    );
    devices.push(steamDeck);

    logger.debug(steamDeck.debug());
  }

  logger.debug(`amount of devices to process: ${devices.length}`);

  logger.trace("switch (mode) statement starts");
  switch (mode) {
    case "list":
      logger.trace(`entering the "list" case`);
      await modes.list(devices);
      break;
    default:
      logger.warn(`Mode ${mode} not implemented yet`);
  }
  logger.trace("switch (mode) statement ends");

  logger.trace("main() function ends");
};

main();
