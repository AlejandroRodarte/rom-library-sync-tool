import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import { type DirAccessItem as FileIODirAccessItem } from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { WriteConsoleMediaNameListOperation } from "../../../../interfaces/write-console-media-name-list-operation.interface.js";
import logger from "../../../../objects/logger.object.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";
import buildMediaListsDirPaths from "./build-media-lists-dir-paths.helper.js";
import buildWriteConsoleMediaNameListOperations from "./build-write-console-media-name-list-operations.helper.js";
import validateMediaListsDirs from "./validate-media-lists-dirs.helper.js";

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

  const ops = buildWriteConsoleMediaNameListOperations(paths, consolesData);

  await validateMediaListsDirs(
    mediaDirPaths,
    ops.map((o) => o.paths.device.dir),
    fileIOExtras.allDirsExist,
  );

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
