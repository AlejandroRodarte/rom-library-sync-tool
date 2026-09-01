import GenericDevice from "./lib/classes/devices/generic-device.class.js";
import {
  DIFF,
  DIFF_SYNC,
  LIST,
  LIST_DIFF,
  LIST_DIFF_SYNC,
  SYNC,
} from "./lib/constants/modes/mode-names.constants.js";
import type { GenericDeviceOpts } from "./lib/interfaces/classes/devices/generic-device/generic-device-opts.interface.js";
import consolesGamesFilterFunctions from "./lib/objects/devices/consoles-games-filter-functions.object.js";
import genericDevicePathsFromDeviceEnvDataBuilders from "./lib/objects/devices/generic-device-paths-from-device-env-data-builders.object.js";
import environment from "./lib/objects/environment.object.js";
import logger from "./lib/objects/logger.object.js";
import type { DeepPartial } from "./lib/types/deep-partial.type.js";

const main = async () => {
  const mode = environment.options.mode;
  logger.debug(`Mode: ${mode}`);

  const genericDevices: GenericDevice[] = [];

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

    genericDevices.push(new GenericDevice(deviceName, deviceData, opts));
  }

  logger.debug(`amount of devices to process: ${genericDevices.length}`);

  for (const genericDevice of genericDevices) {
    if (mode !== DIFF) {
      const connectionError = await genericDevice.connect();

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
      case LIST: {
        const listError = await genericDevice.list();
        if (listError) logger.error(listError.reason);
        break;
      }
      case DIFF: {
        const diffError = await genericDevice.diff();
        if (diffError) logger.error(diffError.reason);
        break;
      }
      case SYNC: {
        const syncError = await genericDevice.sync();
        if (syncError) logger.error(syncError.reason);
        break;
      }
      case LIST_DIFF: {
        const listError = await genericDevice.list();

        if (listError) {
          logger.error(listError.reason);
          break;
        }

        const diffError = await genericDevice.diff();
        if (diffError) logger.error(diffError.reason);
        break;
      }
      case DIFF_SYNC: {
        const diffError = await genericDevice.diff();

        if (diffError) {
          logger.error(diffError.reason);
          break;
        }

        const syncError = await genericDevice.sync();
        if (syncError) logger.error(syncError.reason);
        break;
      }
      case LIST_DIFF_SYNC: {
        const listError = await genericDevice.list();

        if (listError) {
          logger.error(listError.reason);
          break;
        }

        const diffError = await genericDevice.diff();

        if (diffError) {
          logger.error(diffError.reason);
          break;
        }

        const syncError = await genericDevice.sync();
        if (syncError) logger.error(syncError.reason);
        break;
      }
    }

    if (mode !== DIFF) {
      const disconnectionError = await genericDevice.disconnect();

      if (disconnectionError)
        logger.error(
          `An error happened while trying to disconnect from this device.`,
          disconnectionError.toString(),
        );
    }
  }
};

main();
