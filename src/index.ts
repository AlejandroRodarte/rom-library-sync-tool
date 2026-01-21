import environment from "./objects/environment.object.js";
import logger from "./objects/logger.object.js";
import modes from "./helpers/modes/index.js";
import type { Device } from "./interfaces/device.interface.js";
import AlejandroG751JT from "./classes/devices/alejandro-g751jt.class.js";
import type { Debug } from "./interfaces/debug.interface.js";
import type { FileIO } from "./interfaces/file-io.interface.js";
import Fs from "./classes/file-io/fs.class.js";
import Sftp from "./classes/file-io/sftp.class.js";
import SftpClient from "./classes/sftp-client.class.js";

const main = async () => {
  logger.trace("main() function starts");

  const mode = environment.options.mode;
  logger.debug(`Mode: ${mode}`);

  const devices: (Device & Debug)[] = [];

  let alejandroG751JT: AlejandroG751JT | undefined;

  if (environment.device.names.includes("alejandro-g751jt")) {
    const env = environment.device.data["alejandro-g751jt"];

    let fileIO: FileIO;

    switch (env.fileIO.strategy) {
      case "fs": {
        fileIO = new Fs(env.fileIO.data.fs.crud.strategy);
        break;
      }
      case "sftp": {
        fileIO = new Sftp(
          new SftpClient("alejandro-g751jt", env.fileIO.data.sftp.credentials),
        );
        break;
      }
    }

    alejandroG751JT = new AlejandroG751JT(env, fileIO);
    devices.push(alejandroG751JT);
  }

  logger.debug(`amount of devices to process: ${devices.length}`);

  switch (mode) {
    case "list":
      await modes.list(devices);
      break;
    default:
      logger.warn(`Mode ${mode} not implemented yet`);
  }
};

main();
