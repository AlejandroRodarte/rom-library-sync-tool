import environment from "./objects/environment.object.js";
import logger from "./objects/logger.object.js";

import Device from "./classes/device.class.js";

import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import unselect from "./helpers/unselect/index.js";
import app from "./helpers/app/index.js";

const main = async () => {
  const devices = environment.options.filter.devices.map(
    (deviceName) =>
      new Device(deviceName, environment.devices[deviceName].consoles),
  );

  const validateDbPathsError = await app.validateDbPathsWithDevices(devices);
  if (validateDbPathsError) {
    logger.error(`${validateDbPathsError.toString()}\nTerminating.`);
    return;
  }

  for (const device of devices) {
    await device.populateConsoles();

    for (const [_, konsole] of device.consoles) {
      switch (device.name) {
        case "local":
          konsole.unselectTitles(unselect.byLocalDevice);
          break;
        case "steam-deck":
          konsole.unselectTitles(unselect.bySteamDeckDevice);
          break;
      }
    }

    device.updateConsolesMetadata();

    const duplicatesFileError = await fileIO.writeDuplicateRomsFile(device);
    if (duplicatesFileError) logger.error(duplicatesFileError.toString());
    const scrappedFileError = await fileIO.writeScrappedRomsFile(device);
    if (scrappedFileError) logger.error(scrappedFileError.toString());

    for (const [_, konsole] of device.consoles)
      await fileIO.writeConsoleDiffFile(konsole, device.paths);

    await device.sync();
    log.consolesReport(device.consoles);
  }
};

main();
