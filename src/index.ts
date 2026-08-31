import GenericDevice from "./lib/classes/devices/generic-device.class.js";
import {
  DIFF,
  DIFF_SYNC,
  LIST,
  LIST_DIFF,
  LIST_DIFF_SYNC,
  SYNC,
} from "./lib/constants/modes/mode-names.constants.js";
import modes from "./lib/helpers/modes/index.js";
import type { GenericDeviceOpts } from "./lib/interfaces/classes/devices/generic-device/generic-device-opts.interface.js";
import type { Debug } from "./lib/interfaces/debug.interface.js";
import type { Device } from "./lib/interfaces/device.interface.js";
import consolesGamesFilterFunctions from "./lib/objects/devices/consoles-games-filter-functions.object.js";
import genericDevicePathsFromDeviceEnvDataBuilders from "./lib/objects/devices/generic-device-paths-from-device-env-data-builders.object.js";
import environment from "./lib/objects/environment.object.js";
import logger from "./lib/objects/logger.object.js";
import type { DeepPartial } from "./lib/types/deep-partial.type.js";

const main = async () => {
  const mode = environment.options.mode;
  logger.debug(`Mode: ${mode}`);

  const devices: (Device & Debug)[] = [];

  for (const deviceName of environment.device.names) {
    const deviceData = environment.device.data[deviceName];
    if (!deviceData) continue;

    const opts: DeepPartial<GenericDeviceOpts> = {};
    if (genericDevicePathsFromDeviceEnvDataBuilders[deviceName])
      opts.build = {
        paths: {
          deviceEnvDataToGenericDevicePathsFn:
            genericDevicePathsFromDeviceEnvDataBuilders[deviceName],
        },
      };
    if (consolesGamesFilterFunctions[deviceName])
      opts.filter = {
        roms: {
          consolesGamesFilterFn: consolesGamesFilterFunctions[deviceName],
        },
      };

    devices.push(new GenericDevice(deviceName, deviceData, opts));
  }

  logger.debug(`amount of devices to process: ${devices.length}`);

  for (const device of devices) {
    if (mode !== "diff") {
      const connectionError = await device.connect();

      if (connectionError) {
        logger.error(
          `An error happened while trying to connect to this device.`,
          connectionError.toString(),
          `Will skip this device.`,
        );
        continue;
      }
    }

    switch (mode) {
      case LIST:
        await modes.list(device);
        break;
      case DIFF:
        await modes.diff(device);
        break;
      case SYNC:
        await modes.sync(device);
        break;
      case LIST_DIFF:
        await modes.list(device);
        await modes.diff(device);
        break;
      case DIFF_SYNC:
        await modes.diff(device);
        await modes.sync(device);
        break;
      case LIST_DIFF_SYNC:
        await modes.list(device);
        await modes.diff(device);
        await modes.sync(device);
        break;
    }

    if (mode !== "diff") {
      const disconnectionError = await device.disconnect();

      if (disconnectionError)
        logger.error(
          `An error happened while trying to disconnect from this device.`,
          disconnectionError.toString(),
        );
    }
  }
};

main();
