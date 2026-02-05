import AppBadTypeError from "../../classes/errors/app-bad-type-error.class.js";
import type { Debug } from "../../interfaces/debug.interface.js";
import type { Device } from "../../interfaces/device.interface.js";
import environment from "../../objects/environment.object.js";
import logger from "../../objects/logger.object.js";
import type { ModeName } from "../../types/modes/mode-name.type.js";

const allowedModes: ModeName[] = [
  "diff",
  "diff-sync",
  "diff-sync-list",
  "list-diff-sync-list",
];

const diff = async (devices: (Device & Debug)[]) => {
  const mode = environment.options.mode;
  logger.debug(`Mode: ${mode}, Allowed Modes: ${allowedModes.join(",")}`);

  if (!allowedModes.includes(mode))
    throw new AppBadTypeError(
      `Mode ${mode} is NOT supported for the diff task. Plase operate one one of the following modes to make it work: ${allowedModes.join(",")}.`,
    );

  for (const device of devices) {
    await device.populate();
    device.filter();
    await device.write.diffs();
  }
};

export default diff;
