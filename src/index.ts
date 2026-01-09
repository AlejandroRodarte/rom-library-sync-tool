import ENVIRONMENT from "./constants/environment.constant.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import DEVICE_NAMES from "./constants/device-names.constant.js";
import Device from "./classes/device.class.js";
import unselect from "./helpers/unselect/index.js";

const main = async () => {
  const dbRomsDirPathExistsError = await fileIO.dirExists(
    ENVIRONMENT.paths.dbs.roms,
  );
  if (dbRomsDirPathExistsError) {
    console.log(dbRomsDirPathExistsError.message);
    console.log("No ROMs directory exists. Terminating.");
    return;
  }

  for (const deviceName of DEVICE_NAMES) {
    const device = new Device(deviceName, [
      "atari2600",
      "atari7800",
      "gamegear",
      "gb",
      "gba",
      "gbc",
      "mastersystem",
      "nes",
      "snes",
    ]);

    const [allDeviceDirsAreReady, deviceDirsExistError] =
      await fileIO.allDirsExistAndAreReadableAndWritable([
        device.paths.base,
        device.paths.diffs,
        device.paths.lists,
        device.paths.failed,
      ]);
    if (deviceDirsExistError) {
      console.log(deviceDirsExistError.message);
      console.log("Continuing with the next device.");
      continue;
    }
    if (!allDeviceDirsAreReady) {
      console.log(
        "Not all device directories are read/write. Continuing with the next device.",
      );
      continue;
    }

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
    if (duplicatesFileError) console.log(duplicatesFileError.message);
    const scrappedFileError = await fileIO.writeScrappedRomsFile(device);
    if (scrappedFileError) console.log(scrappedFileError.message);

    for (const [_, konsole] of device.consoles)
      await fileIO.writeConsoleDiffFile(konsole, device.paths);

    await device.sync();
    log.consolesReport(device.consoles);
  }
};

main();
