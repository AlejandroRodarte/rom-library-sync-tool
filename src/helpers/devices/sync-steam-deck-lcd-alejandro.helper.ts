import path from "path";

import FsFileExistsError from "../../classes/errors/fs-file-exists-error.class.js";
import SftpNotFoundError from "../../classes/errors/sftp-not-found-error.class.js";
import logger from "../../objects/logger.object.js";
import steamDeckSftpClient, {
  type SteamDeckSftpClientError,
} from "../build/steam-deck-sftp-client.helper.js";
import diffActionFromDiffLine from "../build/diff-action-from-diff-line.helper.js";
import diffLineFromDiffAction from "../build/diff-line-from-diff-action.helper.js";
import type { AllDirsExistMethodError } from "../../classes/sftp-client.class.js";
import type { DiffAction } from "../../types/diff-action.type.js";
import type SteamDeckLCDAlejandro from "../../classes/devices/steam-deck-lcd-alejandro.class.js";
import databasePaths from "../../objects/database-paths.object.js";
import type {
  GetConsoleRomsDiffFilePath,
  GetConsoleRomsFailedFilePathError,
  GetConsoleRomsSyncDirPath,
} from "../../classes/devices/steam-deck-lcd-alejandro.class.js";
import writeFile from "../wrappers/modules/fs/write-file.helper.js";
import fileExists from "../extras/fs/file-exists.helper.js";
import openNewWriteOnlyFile, {
  type OpenNewWriteOnlyFileError,
} from "../extras/fs/open-new-write-only-file.helper.js";
import fileExistsAndReadUtf8Lines from "../extras/fs/file-exists-and-read-utf8-lines.helper.js";
import fileIsEmpty from "../extras/fs/file-is-empty.helper.js";
import deleteFile from "../extras/fs/delete-file.helper.js";
import anyFileExists, {
  type AnyFileExistsError,
} from "../extras/fs/any-file-exists.helper.js";
import type { FileExistsAndIsReadableError } from "../extras/fs/file-exists-and-is-readable.helper.js";

const build = {
  steamDeckSftpClient,
  diffActionFromDiffLine,
  diffLineFromDiffAction,
};

const fsExtras = {
  fileExists,
  openNewWriteOnlyFile,
  fileExistsAndReadUtf8Lines,
  writeFile,
  fileIsEmpty,
  deleteFile,
  anyFileExists,
};

export type SyncSteamDeckError =
  | AnyFileExistsError
  | FsFileExistsError
  | SteamDeckSftpClientError
  | AllDirsExistMethodError
  | SftpNotFoundError
  | GetConsoleRomsFailedFilePathError
  | GetConsoleRomsDiffFilePath
  | GetConsoleRomsSyncDirPath
  | OpenNewWriteOnlyFileError
  | FileExistsAndIsReadableError;

const syncSteamDeckLCDAlejandro = async (
  steamDeck: SteamDeckLCDAlejandro,
): Promise<SyncSteamDeckError | undefined> => {
  const [anyFailedFileExists, anyFileExistsError] =
    await fsExtras.anyFileExists(steamDeck.allFailedFilePaths);
  if (anyFileExistsError) return anyFileExistsError;
  if (!anyFailedFileExists)
    return new FsFileExistsError(
      `Work on those .failed.txt files before attempting to sync the Steam Deck.`,
    );

  const [steamDeckSftpClient, sftpClientError] =
    await build.steamDeckSftpClient();
  if (sftpClientError) return sftpClientError;

  const [allRemoteDirsExist, allRemoteDirsExistError] =
    await steamDeckSftpClient.allDirsExist(steamDeck.allSyncDirPaths);
  if (allRemoteDirsExistError) return allRemoteDirsExistError;
  if (!allRemoteDirsExist)
    return new SftpNotFoundError(
      `Not all of the following directories exist:\n${steamDeck.allSyncDirPaths.join("\n")}\nPlease ensure they exist before syncing this device.`,
    );

  for (const [consoleName, konsole] of steamDeck.romsSyncableConsoles) {
    const [romsFailedFilePath, failedFilePathError] =
      steamDeck.getConsoleRomsFailedFilePath(consoleName);
    if (failedFilePathError) return failedFilePathError;

    const [romsDiffFilePath, diffFilePathError] =
      steamDeck.getConsoleRomsDiffFilePath(consoleName);
    if (diffFilePathError) return diffFilePathError;

    const [romsRemoteDirPath, romsDirPathError] =
      steamDeck.getConsoleRomsSyncDirPath(consoleName);
    if (romsDirPathError) return romsDirPathError;

    const [failedFileHandle, failedFileOpenError] =
      await fsExtras.openNewWriteOnlyFile(romsFailedFilePath);

    if (failedFileOpenError) return failedFileOpenError;

    const [diffLines, diffFileError] =
      await fsExtras.fileExistsAndReadUtf8Lines(romsDiffFilePath);
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

    const failedFileWriteError = await fsExtras.writeFile(
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

    const secondFailedFileWriteError = await fsExtras.writeFile(
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
      await fsExtras.fileIsEmpty(romsFailedFilePath);

    if (failedFileAccessError) {
      logger.warn(
        `Unable to access failed file.\n${failedFileAccessError.toString()}`,
      );
      continue;
    }

    if (failedFileIsEmpty) {
      const failedFileDeleteError = await fsExtras.deleteFile(
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

export default syncSteamDeckLCDAlejandro;
