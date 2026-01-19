import environment from "./objects/environment.object.js";
import logger from "./objects/logger.object.js";
import modes from "./helpers/modes/index.js";
import type { Device } from "./interfaces/device.interface.js";
import AlejandroG751JT from "./classes/devices/alejandro-g751jt.class.js";
import SteamDeckLCDAlejandro from "./classes/devices/steam-deck-lcd-alejandro.class.js";
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
  let steamDeckLCDAlejandro: SteamDeckLCDAlejandro | undefined;

  if (environment.device.names.includes("alejandro-g751jt")) {
    logger.trace("Creating and adding new alejandro-g751jt device");

    const env = environment.device.data["steam-deck-lcd-alejandro"];

    let fileIO: FileIO;

    switch (env.fileIO.strategy) {
      case "fs": {
        fileIO = new Fs(env.fileIO.data.fs.crud.strategy);
        break;
      };
      case "sftp": {
        await using sftp = new Sftp(new SftpClient("alejandro-g751jt", env.fileIO.data.sftp.credentials))
        fileIO = sftp;
      };
    }

    alejandroG751JT = new AlejandroG751JT(env, fileIO);
    devices.push(alejandroG751JT);

    logger.debug(alejandroG751JT.debug());
  }

  if (environment.device.names.includes("steam-deck-lcd-alejandro")) {
    logger.trace("Creating and adding new steam-deck-lcd-alejandro device");

    steamDeckLCDAlejandro = new SteamDeckLCDAlejandro(
      environment.device.data["steam-deck-lcd-alejandro"],
    );
    devices.push(steamDeckLCDAlejandro);

    logger.debug(steamDeckLCDAlejandro.debug());
  }

  logger.debug(`amount of devices to process: ${devices.length}`);

  logger.trace("switch (mode) statement starts");
  switch (mode) {
    case "list":
      logger.trace(`entering the "list" case`);
      await modes.list(devices);
      break;
    default:
      logger.warn(`Mode ${mode} not implemented yet`);
  }
  logger.trace("switch (mode) statement ends");

  logger.trace("main() function ends");
};

main();
