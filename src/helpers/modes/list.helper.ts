import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import type { Device } from "../../interfaces/device.interface.js";
import environment from "../../objects/environment.object.js";
import logger from "../../objects/logger.object.js";
import type { ModeName } from "../../types/mode-name.type.js";

const allowedModes: ModeName[] = [
  "list",
  "sync-list",
  "diff-sync-list",
  "list-diff-sync-list",
];

const list = async (devices: (Device & Debug)[]) => {
  logger.trace("modes.list() function starts");

  const mode = environment.options.mode;

  if (!allowedModes.includes(mode))
    throw new AppWrongTypeError(
      `Mode ${mode} is NOT supported for the list task. Plase operate one one of the following modes to make it work: ${allowedModes.join(",")}.`,
    );

  logger.trace("modes.list() function ends");
};

export default list;
