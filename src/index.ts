import ENVIRONMENT from "./constants/environment.constant.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import Device from "./classes/device.class.js";
import unselect from "./helpers/unselect/index.js";
import app from "./helpers/app/index.js";

const main = async () => {
  const devices = ENVIRONMENT.options.filter.devices.map(
    (deviceName) =>
      new Device(deviceName, ENVIRONMENT.devices[deviceName].consoles),
  );

  const validateDbPathsError = await app.validateDbPathsWithDevices(devices);
  if (validateDbPathsError) {
    console.log(`${validateDbPathsError.reasons}. Terminating.`);
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
    if (duplicatesFileError) console.log(duplicatesFileError.reasons);
    const scrappedFileError = await fileIO.writeScrappedRomsFile(device);
    if (scrappedFileError) console.log(scrappedFileError.reasons);

    for (const [_, konsole] of device.consoles)
      await fileIO.writeConsoleDiffFile(konsole, device.paths);

    await device.sync();
    log.consolesReport(device.consoles);
  }
};

main();
