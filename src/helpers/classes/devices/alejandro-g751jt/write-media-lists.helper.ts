import type FileIOExtras from "../../../../classes/file-io/file-io-extras.class.js";
import { type DirAccessItem as FileIODirAccessItem } from "../../../../classes/file-io/file-io-extras.class.js";
import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";
import type { ConsoleName } from "../../../../types/console-name.type.js";
import type { ConsolesData } from "../../../../types/consoles-data.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import allDirsExist, {
  type DirAccessItem as FsDirAccessItem,
} from "../../../extras/fs/all-dirs-exist.helper.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLines from "../../../extras/fs/write-lines.helper.js";

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
  const items: {
    project: {
      dirs: string[];
    };
    device: {
      base: {
        dirs: string[];
      };
    };
    ops: {
      device: {
        dir: string;
      };
      project: {
        file: string;
      };
      names: {
        console: ConsoleName;
        media: MediaName;
      };
    }[];
  } = { project: { dirs: [] }, device: { base: { dirs: [] } }, ops: [] };

  items.project.dirs.push(
    paths.dirs.project.base,
    paths.dirs.project.lists.base,
    paths.dirs.project.lists["content-targets"].media.base,
  );

  items.device.base.dirs.push(paths.dirs["content-targets"].media.base);

  for (const mediaName of allMediaNames) {
    const projectMediaNameDir =
      paths.dirs.project.lists["content-targets"].media.names[mediaName];
    if (!projectMediaNameDir) continue;
    items.project.dirs.push(projectMediaNameDir);
  }

  for (const [, consoleData] of Object.entries(consolesData)) {
    const deviceConsoleMediaDirPaths =
      paths.dirs["content-targets"].media.consoles[consoleData.name];

    const projectConsoleMediaFilePaths =
      paths.files.project.lists.media.consoles[consoleData.name];

    if (!deviceConsoleMediaDirPaths || !projectConsoleMediaFilePaths) continue;

    if (!deviceConsoleMediaDirPaths) continue;
    items.device.base.dirs.push(deviceConsoleMediaDirPaths.base);

    for (const mediaName of consoleData["content-targets"].media.names) {
      const deviceConsoleMediaNameDir =
        deviceConsoleMediaDirPaths.names[mediaName];
      if (!deviceConsoleMediaNameDir) continue;

      const projectConsoleMediaNameFile =
        projectConsoleMediaFilePaths[mediaName];
      if (!projectConsoleMediaNameFile) continue;

      items.ops.push({
        device: { dir: deviceConsoleMediaNameDir },
        project: { file: projectConsoleMediaNameFile },
        names: { console: consoleData.name, media: mediaName },
      });
    }
  }

  const projectDirAccessItems: FsDirAccessItem[] = items.project.dirs.map(
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
    ...items.device.base.dirs,
    ...items.ops.map((o) => o.device.dir),
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

  for (const op of items.ops) {
    const [lsEntries, lsError] = await fileIOExtras.fileIO.ls(op.device.dir);

    if (lsError) {
      // skipConsoleMediaName(op.names.console, op.names.media);
      continue;
    }

    const filenames = lsEntries.map((e) => e.name);

    const [listFileHandle, listFileError] = await openFileForWriting(
      op.project.file,
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
