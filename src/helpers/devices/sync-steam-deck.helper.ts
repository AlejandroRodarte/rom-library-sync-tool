import path from "path";
import type { DiffAction } from "../../types.js";
import fileIO from "../file-io/index.js";
import build from "../build/index.js";
import type Device from "../../classes/device.class.js";
import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";
import SftpConnectionError from "../../classes/errors/sftp-connection-error.class.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import ENVIRONMENT from "../../constants/environment.constant.js";

export type SyncSteamDeckError =
  | AppWrongTypeError
  | FsFileExistsError
  | SftpConnectionError
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
  if (sftpClientError)
    return new SftpConnectionError(
      `An error happened while connecting to the Steam Deck via SFTP.\nOriginal error message: ${sftpClientError.message}.`,
    );

  const remoteDirPaths = [
    ENVIRONMENT.devices["steam-deck"].paths.roms,
    ENVIRONMENT.devices["steam-deck"].paths.media,
    ENVIRONMENT.devices["steam-deck"].paths.gamelists,
  ];
  for (const [consoleName] of device.consoles)
    remoteDirPaths.push(
      path.join(ENVIRONMENT.devices["steam-deck"].paths.roms, consoleName),
    );
  const [allRemoteDirsExist, allDirsExistError] =
    await steamDeck.allDirsExist(remoteDirPaths);
  if (allDirsExistError)
    return new SftpConnectionError(
      `An error happened while veryfing all remote directories. Original error message: ${allDirsExistError.message}.`,
    );
  if (!allRemoteDirsExist)
    return new SftpNotFoundError(
      `Not all of the following directories exist:\n${remoteDirPaths.join("\n")}\nPlease ensure they exist before syncing this device.`,
    );

  for (const [consoleName, konsole] of device.consoles) {
    const remoteRomsDirPath = path.join(
      ENVIRONMENT.devices["steam-deck"].paths.roms,
      consoleName,
    );

    const failedFilePath = path.join(
      device.paths.failed,
      `${consoleName}.failed.txt`,
    );

    const [failedFileHandle, failedFileOpenError] =
      await fileIO.openNewWriteOnlyFile(failedFilePath);

    if (failedFileOpenError) {
      console.log(
        `Error: ${failedFileOpenError.reason}. Skipping this console.`,
      );
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
          const dbRomFilePath = path.join(
            konsole.dbPaths.roms,
            diffAction.data.filename,
          );

          const dbRomFileExistsError = await fileIO.fileExists(dbRomFilePath);
          if (dbRomFileExistsError) {
            console.log(
              `Error: ${dbRomFileExistsError.reason}. Adding diff action to failed file.`,
            );
            failedDiffActions.push(diffAction);
            break;
          }

          const remoteRomFilePath = path.join(
            remoteRomsDirPath,
            diffAction.data.filename,
          );

          const remoteRomFileExistsError =
            steamDeck.fileExists(remoteRomFilePath);

          if (!remoteRomFileExistsError) {
            console.log(
              `ROM ${diffAction.data.filename} already exists in ${remoteRomFilePath}. Omitting.`,
            );
            break;
          }

          const steamDeckAddFileError = await steamDeck.addFile(
            dbRomFilePath,
            remoteRomFilePath,
            "KEEP",
          );
          if (steamDeckAddFileError) {
            console.log(
              `Something went wrong while transferring the file from ${dbRomFilePath} to ${remoteRomFilePath}. Error message: ${steamDeckAddFileError.reason}. Adding this diff action to the failed file.`,
            );
            failedDiffActions.push(diffAction);
          }

          break;
        }
        case "remove-file": {
          const remoteRomFilePath = path.join(
            remoteRomsDirPath,
            diffAction.data.filename,
          );

          const steamDeckRemoveFileError = await steamDeck.deleteFile(
            remoteRomFilePath,
            false,
          );
          if (steamDeckRemoveFileError) {
            console.log(
              `Something went wrong while removing file ${diffAction.data.filename} at ${remoteRomFilePath}. Error message: ${steamDeckRemoveFileError.reason}. Adding this diff action to the failed file.`,
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

  const disconnectError = await steamDeck.disconnect();
  if (disconnectError)
    console.log(
      `Error while disconnecting from the Steam Deck. Error message: ${disconnectError.reason}.`,
    );
};

export default syncSteamDeck;
