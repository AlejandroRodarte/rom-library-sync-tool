import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import { type DirAccessItem as FileIODirAccessItem } from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTMediaListsDirPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-media-lists-dir-paths.interface.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";
import buildMediaListsDirPaths from "./build-media-lists-dir-paths.helper.js";

const fsExtras = {
  allDirsExist,
  openFileForWriting,
  writeLines,
};

const writeMediaLists = async (
  paths: AlejandroG751JTPaths,
  consolesData: ConsolesData,
  allMediaNames: MediaName[],
  fileIOExtras: FileIOExtras,
) => {
  const mediaDirPaths = buildMediaListsDirPaths(
    paths.dirs,
    Object.entries(consolesData).map(([, c]) => c.name),
    allMediaNames,
  );

  const ops: WriteConsoleMediaNameListOperation[] = [];

  for (const [, consoleData] of Object.entries(consolesData)) {
    const deviceConsoleMediaDirPaths =
      paths.dirs["content-targets"].media.consoles[consoleData.name];

    const projectConsoleMediaFilePaths =
      paths.files.project.lists.media.consoles[consoleData.name];

    if (!deviceConsoleMediaDirPaths || !projectConsoleMediaFilePaths) continue;

    for (const mediaName of consoleData["content-targets"].media.names) {
      const deviceConsoleMediaNameDir =
        deviceConsoleMediaDirPaths.names[mediaName];
      if (!deviceConsoleMediaNameDir) continue;

      const projectConsoleMediaNameFile =
        projectConsoleMediaFilePaths[mediaName];
      if (!projectConsoleMediaNameFile) continue;

      ops.push({
        paths: {
          device: { dir: deviceConsoleMediaNameDir },
          project: { file: projectConsoleMediaNameFile },
        },
        names: { console: consoleData.name, media: mediaName },
      });
    }
  }

  const projectDirAccessItems: FsDirAccessItem[] = mediaDirPaths.project.map(
    (p) => ({
      type: "dir",
      path: p,
      rights: "rw",
    }),
  );

  const [allProjectDirsExistResult, allProjectDirsExistError] =
    await fsExtras.allDirsExist(projectDirAccessItems);

  if (allProjectDirsExistError) return allProjectDirsExistError;
  if (!allProjectDirsExistResult.allExist)
    return allProjectDirsExistResult.error;

  const deviceDirAccessItems: FileIODirAccessItem[] = [
    ...mediaDirPaths.device.base,
    ...ops.map((o) => o.paths.device.dir),
  ].map((p) => ({
    type: "dir",
    path: p,
    rights: "r",
  }));

  const [allDeviceDirsExistResult, allDeviceDirsExistError] =
    await fileIOExtras.allDirsExist(deviceDirAccessItems);

  if (allDeviceDirsExistError) return allProjectDirsExistError;
  if (!allDeviceDirsExistResult.allExist)
    return allProjectDirsExistResult.error;

  logger.debug(...mediaDirPaths.project);
  logger.debug(...mediaDirPaths.device.base);

  for (const op of ops) {
    const [lsEntries, lsError] = await fileIOExtras.fileIO.ls(
      op.paths.device.dir,
    );

    if (lsError) {
      // skipConsoleMediaName(op.names.console, op.names.media);
      continue;
    }

    const filenames = lsEntries.map((e) => e.name);

    const [listFileHandle, listFileError] = await openFileForWriting(
      op.paths.project.file,
      { overwrite: true },
    );

    if (listFileError) {
      // skipConsoleMediaName(op.names.console, op.names.media);
      continue;
    }

    const writeLinesError = await writeLines(listFileHandle, filenames, "utf8");

    if (writeLinesError) {
      await listFileHandle.close();
      // skipConsoleMediaName(op.names.console, op.names.media);
      continue;
    }

    await listFileHandle.close();
  }
};

export default writeMediaLists;
