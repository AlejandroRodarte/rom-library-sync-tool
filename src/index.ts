import ENVIRONMENT from "./constants/environment.constant.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import build from "./helpers/build/index.js";
import DEVICE_NAMES from "./constants/device-names.constant.js";
import { ROMS_DATABASE_DIR_PATH } from "./constants/paths.constants.js";
import devices from "./helpers/devices/index.js";
import unselect from "./helpers/unselect/index.js";

const main = async () => {
  const dbRomsDirPathExistsError = await fileIO.dirExists(
    ROMS_DATABASE_DIR_PATH,
  );
  if (dbRomsDirPathExistsError) {
    console.log(dbRomsDirPathExistsError.message);
    console.log("No ROMs directory exists. Terminating.");
    return;
  }

  for (const deviceName of DEVICE_NAMES) {
    const deviceDirPaths = build.deviceDirPathsFromName(deviceName);

    const [allDeviceDirsAreReady, deviceDirsExistError] =
      await fileIO.allDirsExistAndAreReadableAndWritable([
        deviceDirPaths.base,
        deviceDirPaths.diffs,
        deviceDirPaths.lists,
        deviceDirPaths.failed,
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

    const consoles = build.emptyConsoles();

    for (const [consoleName, konsole] of consoles) {
      const titles = await build.titlesFromConsoleName(consoleName);

      for (const [titleName, title] of titles) {
        switch (deviceName) {
          case "local":
            unselect.byLocalDevice(titleName, title);
            break;
          case "steam-deck":
            unselect.bySteamDeckDevice(titleName, title);
            break;
        }
        konsole.addTitle(titleName, title);
      }

      konsole.updateSelectedTitles();
      konsole.updateScrappedTitles();
      konsole.updateSelectedRoms();
    }

    const duplicatesFileError = await fileIO.writeDuplicateRomsFile(
      deviceName,
      consoles,
    );
    if (duplicatesFileError) console.log(duplicatesFileError.message);
    const scrappedFileError = await fileIO.writeScrappedRomsFile(
      deviceName,
      consoles,
    );
    if (scrappedFileError) console.log(scrappedFileError.message);

    for (const [name, konsole] of consoles)
      await fileIO.writeConsoleDiffFile(name, konsole, deviceDirPaths);

    switch (deviceName) {
      case "local":
        if (!ENVIRONMENT.devices.local.update) break;
        await devices.updateLocal(consoles);
        break;
      case "steam-deck":
        if (!ENVIRONMENT.devices.steamDeck.update) break;
        await devices.updateSteamDeck(consoles);
        break;
      default:
        break;
    }

    log.consolesReport(consoles);
  }
};

main();
