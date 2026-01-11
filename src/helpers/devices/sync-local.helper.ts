import path from "path";

import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";
import FsNotFoundError from "../../classes/errors/fs-not-found-error.class.js";
import logger from "../../objects/logger.object.js";
import environment from "../../objects/environment.object.js";
import diffActionFromDiffLine from "../build/diff-action-from-diff-line.helper.js";
import diffLineFromDiffAction from "../build/diff-line-from-diff-action.helper.js";
import allDirsExistAndAreReadableAndWritable, {
  type AllDirsExistAndAreReadableAndWritableError,
} from "../file-io/all-dirs-exist-and-are-readable-and-writable.helper.js";
import openNewWriteOnlyFile from "../file-io/open-new-write-only-file.helper.js";
import fileExistsAndReadUtf8Lines from "../file-io/file-exists-and-read-utf8-lines.helper.js";
import createFileSymlink from "../file-io/create-file-symlink.helper.js";
import deleteFileSymlink from "../file-io/delete-file-symlink.helper.js";
import writeToFile from "../file-io/write-to-file.helper.js";
import fileExists from "../file-io/file-exists.helper.js";
import fileIsEmpty from "../file-io/file-is-empty.helper.js";
import deleteFile from "../file-io/delete-file.helper.js";
import anyFileExists, {
  type AnyFileExistsError,
} from "../file-io/any-file-exists.helper.js";
import type Device from "../../classes/device.class.js";
import type { DiffAction } from "../../types/diff-action.type.js";

const build = {
  diffActionFromDiffLine,
  diffLineFromDiffAction,
};

const fileIO = {
  fileExists,
  allDirsExistAndAreReadableAndWritable,
  openNewWriteOnlyFile,
  fileExistsAndReadUtf8Lines,
  createFileSymlink,
  deleteFileSymlink,
  writeToFile,
  fileIsEmpty,
  deleteFile,
  anyFileExists,
};

export type SyncLocalError =
  | AppWrongTypeError
  | FsFileExistsError
  | AllDirsExistAndAreReadableAndWritableError
  | FsNotFoundError
  | AnyFileExistsError;

const syncLocal = async (
  device: Device,
): Promise<SyncLocalError | undefined> => {
  if (device.name !== "local")
    return new AppWrongTypeError(
      `This functions expects a steam-deck device, NOT a ${device.name} device.`,
    );

  const [anyFailedFileExists, anyFileExistsError] = await fileIO.anyFileExists(
    device.consolesFailedFilePaths,
  );
  if (anyFileExistsError) return anyFileExistsError;
  if (!anyFailedFileExists)
    return new FsFileExistsError(
      `Work on those .failed.txt files before attempting to sync the Steam Deck.`,
    );

  const localDirPaths = [environment.devices.local.paths.roms];
  for (const [consoleName] of device.consoles)
    localDirPaths.push(
      path.join(environment.devices.local.paths.roms, consoleName),
    );

  const [allLocalDirsExist, allDirsExistError] =
    await fileIO.allDirsExistAndAreReadableAndWritable(localDirPaths);
  if (allDirsExistError) {
    allDirsExistError.addReason(
      `Something went wrong while validating all local device directories.`,
    );
    return allDirsExistError;
  }
  if (!allLocalDirsExist)
    return new FsNotFoundError(
      `Not all of the following directories exist and are read/write:\n${localDirPaths.join("\n")}. Please verify they do before syncing this device.`,
    );

  for (const [name, konsole] of device.consoles) {
    const localRomsDirPath = path.join(environment.devices.local.paths.roms);

    const failedFilePath = path.join(device.paths.failed, `${name}.failed.txt`);

    const [failedFileHandle, failedFileOpenError] =
      await fileIO.openNewWriteOnlyFile(failedFilePath);

    if (failedFileOpenError) {
      logger.warn(`${failedFileOpenError.toString()}\nSkipping this console.`);
      konsole.skipped = true;
      continue;
    }

    const diffFilePath = path.join(device.paths.diffs, `${name}.diff.txt`);

    const [diffLines, diffFileError] =
      await fileIO.fileExistsAndReadUtf8Lines(diffFilePath);
    let failedDiffLines = "";

    if (diffFileError) {
      logger.warn(`${diffFileError.toString()}\nSkipping this console.`);
      konsole.skipped = true;
      continue;
    }

    const diffActions: DiffAction[] = [];
    const failedDiffActions: DiffAction[] = [];

    for (const diffLine of diffLines) {
      const [diffAction, diffActionBuildError] =
        build.diffActionFromDiffLine(diffLine);

      if (diffActionBuildError) {
        logger.warn(
          `${diffActionBuildError.toString()}\nAdding diff line to failed file.`,
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
      logger.error(
        `Console: ${konsole.name}. Failed to write failed diff lines to file. Will output content to standard output. Make sure to copy it elsewhere.\n${failedDiffLines}`,
      );

    for (const diffAction of diffActions) {
      const dbRomFilePath = path.join(
        konsole.dbPaths.roms,
        diffAction.data.filename,
      );

      const localRomSymlinkPath = path.join(
        localRomsDirPath,
        diffAction.data.filename,
      );

      switch (diffAction.type) {
        case "add-file": {
          const addSymlinkError = await fileIO.createFileSymlink(
            dbRomFilePath,
            localRomSymlinkPath,
            "KEEP",
          );

          if (addSymlinkError) {
            logger.warn(
              `Something went wrong adding symlink ${localRomSymlinkPath} for file ${dbRomFilePath}.\n${addSymlinkError.toString()}\n.Adding this operation to the failed file.`,
            );
            failedDiffActions.push(diffAction);
          }
          break;
        }
        case "remove-file": {
          const removeSymlinkError = await fileIO.deleteFileSymlink(
            localRomSymlinkPath,
            false,
          );

          if (removeSymlinkError) {
            logger.warn(
              `Something went wrong deleting symlink ${localRomSymlinkPath}.\n${removeSymlinkError.toString()}\nAdding this operation to the failed file.`,
            );
            failedDiffActions.push(diffAction);
          }
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
      logger.error(
        `Console: ${konsole.name}. Failed to write failed diff lines to file. Will output content to standard output. Make sure to copy it elsewhere.\n${failedDiffLines}`,
      );

    await failedFileHandle.close();

    const [failedFileIsEmpty, failedFileAccessError] =
      await fileIO.fileIsEmpty(failedFilePath);

    if (failedFileAccessError) {
      logger.error(
        `Unable to access failed file.\n${failedFileAccessError.toString()}`,
      );
      continue;
    }

    if (failedFileIsEmpty) {
      const failedFileDeleteError = await fileIO.deleteFile(
        failedFilePath,
        true,
      );
      if (failedFileDeleteError)
        logger.error(
          `Was not able to delete failed file.\n${failedFileDeleteError.toString()}`,
        );
    }
  }
};

export default syncLocal;
