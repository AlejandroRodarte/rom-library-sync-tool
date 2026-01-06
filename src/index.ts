import ENVIRONMENT from "./constants/environment.constant.js";
import add from "./helpers/add/index.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import build from "./helpers/build/index.js";
import unselect from "./helpers/unselect/index.js";
import DEVICE_NAMES from "./constants/device-names.constant.js";

const main = async () => {
  const romsDirPathExistsError = await fileIO.dirExists(LOCAL_ROMS_DIR_PATH);
  if (romsDirPathExistsError) {
    console.log(romsDirPathExistsError.message);
    console.log("No ROMs directory exists. Terminating.");
    return;
  }

  for (const deviceName of DEVICE_NAMES) {
    const deviceDirPaths = build.deviceDirPathsFromName(deviceName);

    const deviceDirPathsError =
      await fileIO.checkDeviceDirPaths(deviceDirPaths);
    if (deviceDirPathsError) {
      console.log(deviceDirPathsError.message);
      console.log("Continuing with the next device.");
      continue;
    }

    const consoles = build.emptyConsoles();

    for (const [name, konsole] of consoles) {
      const titles = await build.titlesFromConsoleName(name);

      for (const [name, title] of titles) {
        switch (deviceName) {
          case "local":
            unselect.byLocalDevice(name, title);
            break;
          case "steam-deck":
            unselect.bySteamDeckDevice(name, title);
            break;
          default:
            throw new Error("Unrecognized device.");
        }
        add.titleToConsole(title, konsole);
      }
    }

    for (const [name, konsole] of consoles)
      await fileIO.writeConsoleDiffFile(name, konsole, deviceDirPaths);

    for (const [_, konsole] of consoles) log.consoleDuplicates(konsole);
    log.consolesReport(consoles);
  }
};

main();
