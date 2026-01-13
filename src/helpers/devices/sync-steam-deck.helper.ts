import path from "path";

import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import logger from "../../objects/logger.object.js";
import steamDeckSftpClient from "../build/steam-deck-sftp-client.helper.js";
import diffActionFromDiffLine from "../build/diff-action-from-diff-line.helper.js";
import diffLineFromDiffAction from "../build/diff-line-from-diff-action.helper.js";
import fileExists from "../file-io/file-exists.helper.js";
import openNewWriteOnlyFile from "../file-io/open-new-write-only-file.helper.js";
import fileExistsAndReadUtf8Lines from "../file-io/file-exists-and-read-utf8-lines.helper.js";
import writeToFile from "../file-io/write-to-file.helper.js";
import fileIsEmpty from "../file-io/file-is-empty.helper.js";
import deleteFile from "../file-io/delete-file.helper.js";
import anyFileExists, {
  type AnyFileExistsError,
} from "../file-io/any-file-exists.helper.js";
import type {
  AllDirsExistMethodError,
  ConnectMethodError,
} from "../../classes/sftp-client.class.js";
import type { DiffAction } from "../../types/diff-action.type.js";
import type SteamDeck from "../../classes/devices/steam-deck.class.js";
import databasePaths from "../../objects/database-paths.object.js";

const build = {
  steamDeckSftpClient,
  diffActionFromDiffLine,
  diffLineFromDiffAction,
};

const fileIO = {
  fileExists,
  openNewWriteOnlyFile,
  fileExistsAndReadUtf8Lines,
  writeToFile,
  fileIsEmpty,
  deleteFile,
  anyFileExists,
};

export type SyncSteamDeckError =
  | AppWrongTypeError
  | FsFileExistsError
  | ConnectMethodError
  | AllDirsExistMethodError
  | SftpNotFoundError
  | AnyFileExistsError;

const syncSteamDeck = async (
  steamDeck: SteamDeck,
): Promise<SyncSteamDeckError | undefined> => {
  const [anyFailedFileExists, anyFileExistsError] = await fileIO.anyFileExists(
    steamDeck.allFailedFilePaths,
  );
  if (anyFileExistsError) return anyFileExistsError;
  if (!anyFailedFileExists)
    return new FsFileExistsError(
      `Work on those .failed.txt files before attempting to sync the Steam Deck.`,
    );

  const [steamDeckSftpClient, sftpClientError] =
    await build.steamDeckSftpClient();
  if (sftpClientError) {
    sftpClientError.addReason(
      `An error happened while connecting to the Steam Deck via SFTP.`,
    );
    return sftpClientError;
  }

  const [allRemoteDirsExist, allRemoteDirsExistError] =
    await steamDeckSftpClient.allDirsExist(steamDeck.allSyncDirPaths);
  if (allRemoteDirsExistError) {
    allRemoteDirsExistError.addReason(
      `An error happened while veryfing all remote directories.`,
    );
    return allRemoteDirsExistError;
  }
  if (!allRemoteDirsExist)
    return new SftpNotFoundError(
      `Not all of the following directories exist:\n${steamDeck.allSyncDirPaths.join("\n")}\nPlease ensure they exist before syncing this device.`,
    );

  for (const [consoleName, konsole] of steamDeck.consoles()) {
    const romsRemoteDirPath = steamDeck.getConsoleRomsSyncDirPath(consoleName);
    const romsFailedFilePath =
      steamDeck.getConsoleRomsFailedFilePath(consoleName);
    const romsDiffFilePath = steamDeck.getConsoleRomsDiffFilePath(consoleName);

    const [failedFileHandle, failedFileOpenError] =
      await fileIO.openNewWriteOnlyFile(romsFailedFilePath);

    if (failedFileOpenError) return failedFileOpenError;

    const [diffLines, diffFileError] =
      await fileIO.fileExistsAndReadUtf8Lines(romsDiffFilePath);
    let failedDiffLines = "";

    if (diffFileError) return diffFileError;

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
        databasePaths.getConsoleDatabaseRomDirPath(consoleName),
        diffAction.data.filename,
      );

      const remoteRomFilePath = path.join(
        romsRemoteDirPath,
        diffAction.data.filename,
      );

      switch (diffAction.type) {
        case "add-file": {
          const steamDeckAddFileError = await steamDeckSftpClient.addFile(
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
          const steamDeckRemoveFileError = await steamDeckSftpClient.deleteFile(
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
      await fileIO.fileIsEmpty(romsFailedFilePath);

    if (failedFileAccessError) {
      logger.warn(
        `Unable to access failed file.\n${failedFileAccessError.toString()}`,
      );
      continue;
    }

    if (failedFileIsEmpty) {
      const failedFileDeleteError = await fileIO.deleteFile(
        romsFailedFilePath,
        true,
      );
      if (failedFileDeleteError)
        logger.error(
          `Was not able to delete failed file.\n${failedFileDeleteError.toString()}`,
        );
    }
  }

  const disconnectError = await steamDeckSftpClient.disconnect();
  if (disconnectError)
    logger.error(
      `Error while disconnecting from the Steam Deck.\n${disconnectError.toString()}\n`,
    );
};

export default syncSteamDeck;
