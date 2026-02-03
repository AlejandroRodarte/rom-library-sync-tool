import environment from "./objects/environment.object.js";
import logger from "./objects/logger.object.js";
import modes from "./helpers/modes/index.js";
import type { Device } from "./interfaces/device.interface.js";
import GenericDevice from "./classes/devices/generic-device.class.js";
import type { Debug } from "./interfaces/debug.interface.js";

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
