import GenericDevice from "./lib/classes/devices/generic-device.class.js";
import modes from "./lib/helpers/modes/index.js";
import type { Debug } from "./lib/interfaces/debug.interface.js";
import type { Device } from "./lib/interfaces/device.interface.js";
import environment from "./lib/objects/environment.object.js";
import logger from "./lib/objects/logger.object.js";

const main = async () => {
  const mode = environment.options.mode;
  logger.debug(`Mode: ${mode}`);

  const devices: (Device & Debug)[] = [];

  for (const deviceName of environment.device.names) {
    const deviceData = environment.device.data[deviceName];
    if (!deviceData) continue;
    devices.push(new GenericDevice(deviceName, deviceData));
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
    default:
      logger.warn(`Mode ${mode} not implemented yet`);
  }
};

main();
