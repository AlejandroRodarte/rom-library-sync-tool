import environment from "./objects/environment.object.js";
import logger from "./objects/logger.object.js";

import log from "./helpers/log/index.js";
import app from "./helpers/app/index.js";
import Local from "./classes/devices/local.class.js";
import SteamDeck from "./classes/devices/steam-deck.class.js";
import type { Device } from "./interfaces/device.interface.js";

const main = async () => {
  const dbPathsError = await app.validateDatabasePaths();
  if (dbPathsError) {
    logger.error(`${dbPathsError.toString()}\nTerminating.`);
    return;
  }

  const local = new Local(environment.devices.local.modes["diff-sync"].consoles);
  const steamDeck = new SteamDeck(environment.devices["steam-deck"].modes["diff-sync"].consoles);

  const devices: Device[] = [local, steamDeck];

  for (const device of devices) {
    await device.populate();
    device.filter();
    device.update();
    
    await device.write.scrapped();
    await device.write.duplicates();
    await device.write.diffs();

    await device.sync();
    log.consolesReport(device.consoles());
  }
};

main();
