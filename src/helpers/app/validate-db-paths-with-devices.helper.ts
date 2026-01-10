import path from "path";
import ENVIRONMENT from "../../constants/environment.constant.js";
import build from "../build/index.js";
import fileIO from "../file-io/index.js";
import type Device from "../../classes/device.class.js";
import type { AllDirsExistAndAreReadableAndWritableError } from "../file-io/all-dirs-exist-and-are-readable-and-writable.helper.js";
import type { AllDirsExistAndAreReadableError } from "../file-io/all-dirs-exist-and-are-readable.helper.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";

export type ValidateDbPathsWithDevicesError =
  | AllDirsExistAndAreReadableError
  | AllDirsExistAndAreReadableAndWritableError
  | AppValidationError;

const validateDbPathsWithDevices = async (
  devices: Device[],
): Promise<ValidateDbPathsWithDevicesError | undefined> => {
  const readableDirPaths: string[] = [
    ENVIRONMENT.paths.dbs.roms,
    ENVIRONMENT.paths.dbs.media,
    ENVIRONMENT.paths.dbs.gamelists,
  ];

  for (const consoleName of build.consoleNamesFromDevices(devices))
    readableDirPaths.push(
      path.join(ENVIRONMENT.paths.dbs.roms, consoleName),
      path.join(ENVIRONMENT.paths.dbs.media, consoleName),
      path.join(ENVIRONMENT.paths.dbs.gamelists, consoleName),
    );

  const [areAllDirPathsReadable, readableDirPathsError] =
    await fileIO.allDirsExistAndAreReadable(readableDirPaths);

  if (readableDirPathsError) return readableDirPathsError;
  if (!areAllDirPathsReadable)
    return new AppValidationError(
      `Not all of the following directories exist and are readable:\n${readableDirPaths.join("\n")}\nMake sure all of them exist and are readable. Terminating.`,
    );

  const readableAndWritableDirPaths: string[] = [];
  for (const device of devices)
    readableAndWritableDirPaths.push(...device.pathsList);

  const [areAllDirPathsReadableAndWritable, readableAndWritableDirPathsError] =
    await fileIO.allDirsExistAndAreReadableAndWritable(
      readableAndWritableDirPaths,
    );

  if (readableAndWritableDirPathsError) return readableAndWritableDirPathsError;

  if (!areAllDirPathsReadableAndWritable) {
    return new AppValidationError(
      `Not all of the following directories exist and are readable and writable:\n${readableDirPaths.join("\n")}\nMake sure all of them exist and are readable and writable. Terminating.`,
    );
  }
};

export default validateDbPathsWithDevices;
