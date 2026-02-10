import GenericDevice from "./lib/classes/devices/generic-device.class.js";
import modes from "./lib/helpers/modes/index.js";
import type { AsyncDrop } from "./lib/interfaces/async-drop.interface.js";
import type { Debug } from "./lib/interfaces/debug.interface.js";
import type { Device } from "./lib/interfaces/device.interface.js";
import environment from "./lib/objects/environment.object.js";
import logger from "./lib/objects/logger.object.js";

const main = async () => {
  const mode = environment.options.mode;
  logger.debug(`Mode: ${mode}`);

  const devices: (Device & Debug & AsyncDrop)[] = [];

  for (const deviceName of environment.device.names) {
    const deviceData = environment.device.data[deviceName];
    if (!deviceData) continue;

    const [newGenericDevice, buildError] = await GenericDevice.build(
      deviceName,
      deviceData,
    );

    if (buildError) {
      logger.error(
        `Failed to build device ${deviceName}.`,
        buildError.toString(),
        `Skipping this device.`,
      );
      continue;
    }

    devices.push(newGenericDevice);
  }

  logger.debug(`amount of devices to process: ${devices.length}`);

  switch (mode) {
    case "list":
      await modes.list(devices);
      break;
    case "diff":
      await modes.diff(devices);
      break;
    case "sync":
      await modes.sync(devices);
      break;
    case "diff-sync":
      await modes.diff(devices);
      await modes.sync(devices);
      break;
    case "sync-list":
      await modes.sync(devices);
      await modes.list(devices);
      break;
    case "diff-sync-list":
      await modes.diff(devices);
      await modes.sync(devices);
      await modes.list(devices);
      break;
    case "list-diff-sync-list":
      await modes.list(devices);
      await modes.diff(devices);
      await modes.sync(devices);
      await modes.list(devices);
      break;
  }

  logger.info(
    `Finished processing all devices. Disconnecting them from their respective FileIO implementors.`,
  );

  for (const device of devices) await device.asyncDrop();
};

main();
