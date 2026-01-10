import ENVIRONMENT from "./constants/environment.constant.js";
import fileIO from "./helpers/file-io/index.js";
import log from "./helpers/log/index.js";
import Device from "./classes/device.class.js";
import unselect from "./helpers/unselect/index.js";
import path from "node:path";
import build from "./helpers/build/index.js";

const main = async () => {
  const devices = ENVIRONMENT.options.filter.devices.map(
    (deviceName) =>
      new Device(deviceName, ENVIRONMENT.devices[deviceName].consoles),
  );

  const readableDirPaths: string[] = [
    ENVIRONMENT.paths.dbs.roms,
    ENVIRONMENT.paths.dbs.media,
    ENVIRONMENT.paths.dbs.gamelists,
  ];
  const readableAndWritableDirPaths: string[] = [];

  for (const device of devices)
    readableAndWritableDirPaths.push(
      device.paths.base,
      device.paths.diffs,
      device.paths.lists,
      device.paths.failed,
    );

  for (const consoleName of build.consoleNamesFromDevices(devices))
    readableDirPaths.push(
      path.join(ENVIRONMENT.paths.dbs.roms, consoleName),
      path.join(ENVIRONMENT.paths.dbs.media, consoleName),
      path.join(ENVIRONMENT.paths.dbs.gamelists, consoleName),
    );

  const [areAllDirPathsReadable, readableDirPathsError] =
    await fileIO.allDirsExistAndAreReadable(readableDirPaths);
  if (readableDirPathsError) {
    console.log(`${readableDirPathsError.reason}. Terminating.`);
    return;
  }
  if (!areAllDirPathsReadable) {
    console.log(
      `Not all of the following directories exist and are readable:\n${readableDirPaths.join("\n")}\nMake sure all of them exist and are readable. Terminating.`,
    );
    return;
  }

  const [areAllDirPathsReadableAndWritable, readableAndWritableDirPathsError] =
    await fileIO.allDirsExistAndAreReadableAndWritable(
      readableAndWritableDirPaths,
    );
  if (readableAndWritableDirPathsError) {
    console.log(`${readableAndWritableDirPathsError.reason}. Terminating.`);
    return;
  }
  if (!areAllDirPathsReadableAndWritable) {
    console.log(
      `Not all of the following directories exist and are readable and writable:\n${readableDirPaths.join("\n")}\nMake sure all of them exist and are readable and writable. Terminating.`,
    );
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
    if (duplicatesFileError) console.log(duplicatesFileError.reason);
    const scrappedFileError = await fileIO.writeScrappedRomsFile(device);
    if (scrappedFileError) console.log(scrappedFileError.reason);

    for (const [_, konsole] of device.consoles)
      await fileIO.writeConsoleDiffFile(konsole, device.paths);

    await device.sync();
    log.consolesReport(device.consoles);
  }
};

main();
