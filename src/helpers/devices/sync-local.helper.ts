import path from "path";
import type Device from "../../classes/device.class.js";
import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import fileIO from "../file-io/index.js";
import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";
import ENVIRONMENT from "../../constants/environment.constant.js";
import type { DiffAction } from "../../types.js";
import build from "../build/index.js";

const syncLocal = async (device: Device) => {
  if (device.name !== "local")
    return new AppWrongTypeError(
      `This functions expects a steam-deck device, NOT a ${device.name} device.`,
    );

  for (const [name, _] of device.consoles) {
    const failedFilePath = path.join(device.paths.failed, `${name}.failed.txt`);
    const failedFileExistsError = await fileIO.fileExists(failedFilePath);

    if (!failedFileExistsError)
      return new FsFileExistsError(
        `Work on those .failed.txt files before attempting to sync the Steam Deck.`,
      );
  }

  for (const [name, konsole] of device.consoles) {
    const dbRomsDirPath = path.join(ENVIRONMENT.paths.dbs.roms, name);

    const dbRomsDirPathExistsError =
      await fileIO.dirExistsAndIsReadable(dbRomsDirPath);
    if (dbRomsDirPathExistsError) {
      console.log(
        `Error: ${dbRomsDirPathExistsError.reason}. Skipping this console.`,
      );
      konsole.skipped = true;
      continue;
    }

    const localRomsDirPath = path.join(
      ENVIRONMENT.devices.local.paths.roms,
      name,
    );
    const localRomsDirPathExistsError =
      await fileIO.dirExists(localRomsDirPath);
    if (localRomsDirPathExistsError) {
      console.log(
        `Error: ${localRomsDirPathExistsError.reason}. Skipping this console.`,
      );
      konsole.skipped = true;
      continue;
    }

    const failedFilePath = path.join(device.paths.failed, `${name}.failed.txt`);

    const [failedFileHandle, failedFileOpenError] =
      await fileIO.openNewWriteOnlyFile(failedFilePath);

    if (failedFileOpenError) {
      console.log(
        `Error: ${failedFileOpenError.reason}. Skipping this console.`,
      );
      konsole.skipped = true;
      continue;
    }

    const diffFilePath = path.join(device.paths.diffs, `${name}.diff.txt`);

    const [diffLines, diffFileError] =
      await fileIO.fileExistsAndReadUtf8Lines(diffFilePath);
    let failedDiffLines = "";

    if (diffFileError) {
      console.log(`Error: ${diffFileError.reason}. Skipping this console.`);
      konsole.skipped = true;
      continue;
    }

    const diffActions: DiffAction[] = [];
    const failedDiffActions: DiffAction[] = [];

    for (const diffLine of diffLines) {
      const [diffAction, diffActionBuildError] =
        build.diffActionFromDiffLine(diffLine);

      if (diffActionBuildError) {
        console.log(
          `Error: ${diffActionBuildError.reason}. Adding diff line to failed file.`,
        );
        failedDiffLines += `${diffLine}\n`;
        continue;
      }

      diffActions.push(diffAction);
    }

    const failedFileWriteError = await fileIO.writeToFile(
      failedFileHandle,
      failedDiffLines,
      "utf8",
    );
    if (failedFileWriteError)
      console.log(
        `Console: ${konsole.name}. Failed to write failed diff lines to file. Will output content to standard output. Make sure to copy it elsewhere.\n${failedDiffLines}`,
      );

    for (const diffAction of diffActions) {
      switch (diffAction.type) {
        case "add-file": {
          break;
        }
        case "remove-file": {
          break;
        }
      }
    }

    failedDiffLines = "";

    for (const diffAction of failedDiffActions) {
      const diffLine = build.diffLineFromDiffAction(diffAction);
      failedDiffLines += `${diffLine}\n`;
    }

    const secondFailedFileWriteError = await fileIO.writeToFile(
      failedFileHandle,
      failedDiffLines,
      "utf8",
    );
    if (secondFailedFileWriteError)
      console.log(
        `Console: ${konsole.name}. Failed to write failed diff lines to file. Will output content to standard output. Make sure to copy it elsewhere.\n${failedDiffLines}`,
      );

    await failedFileHandle.close();

    const [failedFileIsEmpty, failedFileAccessError] =
      await fileIO.fileIsEmpty(failedFilePath);

    if (failedFileAccessError) {
      console.log(
        `Unable to access failed file. Error message: ${failedFileAccessError.reason}.`,
      );
      continue;
    }

    if (failedFileIsEmpty) {
      const failedFileDeleteError = await fileIO.deleteFile(
        failedFilePath,
        true,
      );
      if (failedFileDeleteError)
        console.log(
          `Was not able to delete failed file. Error message: ${failedFileDeleteError.reason}.`,
        );
    }
  }
};

export default syncLocal;
