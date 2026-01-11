import path from "path";
import type { DiffAction } from "../../types.js";
import fileIO from "../file-io/index.js";
import build from "../build/index.js";
import type Device from "../../classes/device.class.js";
import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import type {
  AllDirsExistMethodError,
  ConnectMethodError,
} from "../../classes/sftp-client.class.js";
import logger from "../../objects/logger.object.js";
import environment from "../../objects/environment.object.js";

export type SyncSteamDeckError =
  | AppWrongTypeError
  | FsFileExistsError
  | ConnectMethodError
  | AllDirsExistMethodError
  | SftpNotFoundError;

const syncSteamDeck = async (
  device: Device,
): Promise<SyncSteamDeckError | undefined> => {
  if (device.name !== "steam-deck")
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

  const [steamDeck, sftpClientError] = await build.steamDeckSftpClient();
  if (sftpClientError) {
    sftpClientError.addReason(
      `An error happened while connecting to the Steam Deck via SFTP.`,
    );
    return sftpClientError;
  }

  const remoteDirPaths = [
    environment.devices["steam-deck"].paths.roms,
    environment.devices["steam-deck"].paths.media,
    environment.devices["steam-deck"].paths.gamelists,
  ];
  for (const [consoleName] of device.consoles)
    remoteDirPaths.push(
      path.join(environment.devices["steam-deck"].paths.roms, consoleName),
    );
  const [allRemoteDirsExist, allDirsExistError] =
    await steamDeck.allDirsExist(remoteDirPaths);
  if (allDirsExistError) {
    allDirsExistError.addReason(
      `An error happened while veryfing all remote directories.`,
    );
    return allDirsExistError;
  }
  if (!allRemoteDirsExist)
    return new SftpNotFoundError(
      `Not all of the following directories exist:\n${remoteDirPaths.join("\n")}\nPlease ensure they exist before syncing this device.`,
    );

  for (const [consoleName, konsole] of device.consoles) {
    const remoteRomsDirPath = path.join(
      environment.devices["steam-deck"].paths.roms,
      consoleName,
    );

    const failedFilePath = path.join(
      device.paths.failed,
      `${consoleName}.failed.txt`,
    );

    const [failedFileHandle, failedFileOpenError] =
      await fileIO.openNewWriteOnlyFile(failedFilePath);

    if (failedFileOpenError) {
      logger.warn(`${failedFileOpenError.toString()}\nSkipping this console.`);
      konsole.skipped = true;
      continue;
    }

    const diffFilePath = path.join(
      device.paths.diffs,
      `${consoleName}.diff.txt`,
    );

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

      const remoteRomFilePath = path.join(
        remoteRomsDirPath,
        diffAction.data.filename,
      );

      switch (diffAction.type) {
        case "add-file": {
          const steamDeckAddFileError = await steamDeck.addFile(
            dbRomFilePath,
            remoteRomFilePath,
            "KEEP",
          );

          if (steamDeckAddFileError) {
            logger.warn(
              `Something went wrong while transferring the file from ${dbRomFilePath} to ${remoteRomFilePath}.\n${steamDeckAddFileError.toString()}\nAdding this diff action to the failed file.`,
            );
            failedDiffActions.push(diffAction);
          }

          break;
        }
        case "remove-file": {
          const steamDeckRemoveFileError = await steamDeck.deleteFile(
            remoteRomFilePath,
            false,
          );

          if (steamDeckRemoveFileError) {
            logger.warn(
              `Something went wrong while removing file ${diffAction.data.filename} at ${remoteRomFilePath}.\n${steamDeckRemoveFileError.toString()}.\nAdding this diff action to the failed file.`,
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
      logger.warn(
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

  const disconnectError = await steamDeck.disconnect();
  if (disconnectError)
    logger.error(
      `Error while disconnecting from the Steam Deck.\n${disconnectError.toString()}\n`,
    );
};

export default syncSteamDeck;
