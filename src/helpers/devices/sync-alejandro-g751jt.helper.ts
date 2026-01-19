import path from "path";

import FileIOExistsError from "../../classes/errors/file-io-exists-error.class.js";
import FileIONotFoundError from "../../classes/errors/file-io-not-found-error.class.js";
import logger from "../../objects/logger.object.js";
import diffActionFromDiffLine from "../build/diff-action-from-diff-line.helper.js";
import diffLineFromDiffAction from "../build/diff-line-from-diff-action.helper.js";
import type { DiffAction } from "../../types/diff-action.type.js";
import type AlejandroG751JT from "../../classes/devices/alejandro-g751jt.class.js";
import databasePaths from "../../objects/database-paths.object.js";
import type {
  GetConsoleRomsDiffFilePath,
  GetConsoleRomsFailedFilePathError,
  GetConsoleRomsSyncDirPath,
} from "../../classes/devices/alejandro-g751jt.class.js";
import writeFile from "../wrappers/modules/fs/write-file.helper.js";
import fileExists from "../extras/fs/file-exists.helper.js";
import openNewWriteOnlyFile, {
  type OpenNewWriteOnlyFileError,
} from "../extras/fs/open-new-write-only-file.helper.js";
import createSymlink from "../extras/fs/create-symlink.helper.js";
import deleteSymlink from "../extras/fs/delete-symlink.helper.js";
import fileIsEmpty from "../extras/fs/file-is-empty.helper.js";
import deleteFile from "../extras/fs/delete-file.helper.js";
import anyFileExists, {
  type AnyFileExistsError,
} from "../extras/fs/any-file-exists.helper.js";
import readUTF8Lines, { type ReadUTF8LinesError } from "../extras/fs/read-utf8-lines.helper.js";
import type { AllDirsExistError } from "../extras/fs/all-dirs-exist.helper.js";

const build = {
  diffActionFromDiffLine,
  diffLineFromDiffAction,
};

const fsExtras = {
  fileExists,
  openNewWriteOnlyFile,
  readUTF8Lines,
  createSymlink,
  deleteSymlink,
  writeFile,
  fileIsEmpty,
  deleteFile,
  anyFileExists,
};

export type SyncAlejandroG751JTError =
  | AnyFileExistsError
  | FileIOExistsError
  | AllDirsExistError
  | FileIONotFoundError
  | GetConsoleRomsFailedFilePathError
  | GetConsoleRomsDiffFilePath
  | GetConsoleRomsSyncDirPath
  | OpenNewWriteOnlyFileError
  | ReadUTF8LinesError;

const syncAlejandroG751JT = async (
  alejandroG751JT: AlejandroG751JT,
): Promise<SyncAlejandroG751JTError | undefined> => {
  const [anyFailedFileExists, anyFileExistsError] =
    await fsExtras.anyFileExists(alejandroG751JT.allFailedFilePaths.map((p) => ({ type: "file", path: p, rights: "rw" })));
  if (anyFileExistsError) return anyFileExistsError;
  if (!anyFailedFileExists)
    return new FileIOExistsError(
      `Work on those .failed.txt files before attempting to sync the Steam Deck.`,
    );

  const [allLocalDirsExist, allDirsExistError] =
    await fsExtras.allDirsExist(alejandroG751JT.allSyncDirPaths.map((p) => ({ type: "dir", path: p, rights: "rw" })));
  if (allDirsExistError) return allDirsExistError;
  if (!allLocalDirsExist)
    return new FileIONotFoundError(
      `Not all of the following directories exist and are read/write:\n${alejandroG751JT.allSyncDirPaths.join("\n")}. Please verify they do before syncing this device.`,
    );

  for (const [consoleName, konsole] of alejandroG751JT.syncableConsoles) {
    const [romsFailedFilePath, failedFilePathError] =
      alejandroG751JT.getConsoleRomsFailedFilePath(consoleName);
    if (failedFilePathError) return failedFilePathError;

    const [romsDiffFilePath, diffFilePathError] =
      alejandroG751JT.getConsoleRomsDiffFilePath(consoleName);
    if (diffFilePathError) return diffFilePathError;

    const [localRomsDirPath, romsDirPathError] =
      alejandroG751JT.getConsoleRomsSyncDirPath(consoleName);
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

      const localRomSymlinkPath = path.join(
        localRomsDirPath,
        diffAction.data.filename,
      );

      switch (diffAction.type) {
        case "add-file": {
          const addSymlinkError = await fsExtras.createFileSymlink(
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
          const removeSymlinkError = await fsExtras.deleteFileSymlink(
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
      logger.error(
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
};

export default syncAlejandroG751JT;
