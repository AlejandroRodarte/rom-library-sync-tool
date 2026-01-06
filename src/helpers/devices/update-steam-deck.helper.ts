import path from "path";
import type { Consoles, DiffAction } from "../../types.js";
import fileIO from "../file-io/index.js";
import {
  LOCAL_ROMS_DIR_PATH,
  STEAM_DECK_REMOTE_ROMS_DIR_PATH,
} from "../../constants/paths.constants.js";
import build from "../build/index.js";

const updateSteamDeck = async (consoles: Consoles) => {
  const deviceDirPaths = build.deviceDirPathsFromName("steam-deck");

  let failedFileFound = false;

  for (const [name, _] of consoles) {
    const failedFilePath = path.join(
      deviceDirPaths.failed,
      `${name}.failed.txt`,
    );
    const failedFileExistsError = await fileIO.fileExists(failedFilePath);

    if (!failedFileExistsError) {
      console.log("Failed file found. Will NOT connect to Steam Deck.");
      failedFileFound = true;
      break;
    }
  }

  if (failedFileFound) return;

  const [steamDeck, sftpClientError] = await build.steamDeckSftpClient();

  if (sftpClientError) {
    console.log(sftpClientError.message);
    console.log(
      "Failed to connect to Steam Deck. Continuing with the next device.",
    );
    return;
  }

  const remoteRomsDirExistsError = await steamDeck.dirExists(
    STEAM_DECK_REMOTE_ROMS_DIR_PATH,
  );

  if (remoteRomsDirExistsError) {
    console.log(remoteRomsDirExistsError.message);
    console.log(
      "Steam Deck ROMs directory does not exist. Continuing with the next device.",
    );
    return;
  }

  for (const [name, _] of consoles) {
    const localRomsDirPath = path.join(LOCAL_ROMS_DIR_PATH, name);

    const localRomsDirPathExistsError =
      await fileIO.dirExistsAndIsReadable(localRomsDirPath);
    if (localRomsDirPathExistsError) {
      console.log(localRomsDirPathExistsError.message);
      console.log("Skipping this console.");
      continue;
    }

    const remoteRomsDirPath = path.join(STEAM_DECK_REMOTE_ROMS_DIR_PATH, name);

    const remoteRomsDirPathExistsError =
      await steamDeck.dirExists(remoteRomsDirPath);
    if (remoteRomsDirPathExistsError) {
      console.log(remoteRomsDirPathExistsError.message);
      console.log("Skipping this console.");
      continue;
    }

    const failedFilePath = path.join(
      deviceDirPaths.failed,
      `${name}.failed.txt`,
    );

    const [failedFileHandle, failedFileOpenError] =
      await fileIO.openNewWriteOnlyFile(failedFilePath);

    if (failedFileOpenError) {
      console.log(failedFileOpenError.message);
      console.log("Skipping this console.");
      continue;
    }

    const diffFilePath = path.join(deviceDirPaths.diffs, `${name}.diff.txt`);

    const [diffLines, diffFileError] =
      await fileIO.fileExistsAndReadUtf8Lines(diffFilePath);
    const failedDiffLines: string[] = [];

    if (diffFileError) {
      console.log(diffFileError.message);
      console.log("Skipping this console.");
      continue;
    }

    const diffActions: DiffAction[] = [];
    const failedDiffActions: DiffAction[] = [];

    for (const diffLine of diffLines) {
      const [diffAction, diffActionBuildError] =
        build.diffActionFromDiffLine(diffLine);

      if (diffActionBuildError) {
        console.log(diffActionBuildError.message);
        console.log("Adding this diff line to the failed file.");
        failedDiffLines.push(diffLine);
        continue;
      }

      diffActions.push(diffAction);
    }

    for (const diffLine of failedDiffLines) {
      const writeError = await fileIO.writeToFile(
        failedFileHandle,
        `${diffLine}\n`,
        "utf8",
      );

      if (writeError) {
        console.log(writeError.message);
        continue;
      }
    }

    // 4. loop over each diff file line
    for (const diffAction of diffActions) {
      switch (diffAction.type) {
        case "add-file": {
          const localRomFilePath = path.join(
            localRomsDirPath,
            diffAction.data.filename,
          );

          const localRomFileExistsError =
            await fileIO.fileExists(localRomFilePath);
          if (localRomFileExistsError) {
            console.log(localRomFileExistsError.message);
            console.log("Adding to failed list.");
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
            console.log("This ROM already is in the Steam Deck. Omitting");
            break;
          }

          const steamDeckAddFileError = await steamDeck.addFile(
            localRomFilePath,
            remoteRomFilePath,
          );
          if (steamDeckAddFileError) {
            console.log(steamDeckAddFileError.message);
            console.log("Adding to failed list.");
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
            true,
          );
          if (steamDeckRemoveFileError) {
            console.log(steamDeckRemoveFileError.message);
            console.log("Doesn't matter. Continuing with next action.");
          }

          break;
        }
        default: {
          throw new Error(
            "Unrecognized diff action. This should be unreachable.",
          );
        }
      }
    }

    for (const diffAction of failedDiffActions) {
      const diffLine = build.diffLineFromDiffAction(diffAction);
      // TODO: add diff line to failed file
    }

    await failedFileHandle.close();

    const [failedFileIsEmpty, failedFileAccessError] =
      await fileIO.fileIsEmpty(failedFilePath);

    if (failedFileAccessError) {
      console.log(failedFileAccessError.message);
      console.log("Unable to access failed file.");
      continue;
    }

    if (failedFileIsEmpty) {
      const deleteError = await fileIO.deleteFile(failedFilePath);
      if (deleteError) {
        console.log(deleteError.message);
        console.log("Unable do delete empty failed file.");
      }
    }
  }

  await steamDeck.disconnect();
};

export default updateSteamDeck;
